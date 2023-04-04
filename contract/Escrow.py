# type: ignore
# Escrow - Example for illustrative purposes only.

import smartpy as sp


class Escrow(sp.Contract):
    def __init__(self, mainAdmin):

        self.init(
            mainAdmin=mainAdmin,
            # this escrow contract can have multiple txns
            txns=sp.map(
                l={},
                tkey=sp.TAddress,  # address of the admin
                tvalue=sp.TRecord(
                    owner=sp.TOption(sp.TAddress),
                    counterparty=sp.TOption(sp.TAddress),
                    fromOwner=sp.TMutez,
                    fromCounterparty=sp.TMutez,
                    balanceOwner=sp.TMutez,
                    balanceCounterparty=sp.TMutez,
                    epoch=sp.TTimestamp,
                    hashedSecret=sp.TOption(sp.TBytes),
                    ownerWithdrawn=sp.TBool,
                    counterpartyWithdrawn=sp.TBool,
                    escrowWithdrawn=sp.TBool,
                ),
            ),
            # maps each owner and counterparty to their admin
            partyToAdminMap=sp.map(l={}, tkey=sp.TAddress, tvalue=sp.TAddress),
        )

    @sp.entry_point
    def registerAsAdmin(self):
        sp.verify(~self.data.txns.contains(sp.sender))
        self.initTxnData(sp.sender)

    def initTxnData(self, sender):
        self.data.txns[sender] = sp.record(
            owner=sp.none,
            counterparty=sp.none,
            fromOwner=sp.tez(0),
            fromCounterparty=sp.tez(0),
            balanceOwner=sp.tez(0),
            balanceCounterparty=sp.tez(0),
            epoch=sp.timestamp(0),
            hashedSecret=sp.none,
            ownerWithdrawn=sp.bool(False),
            counterpartyWithdrawn=sp.bool(False),
            escrowWithdrawn=sp.bool(False),
        )

    @sp.entry_point
    def setTxn(self, owner, counterparty, fromOwner, fromCounterparty, epoch, secret):
        sp.verify(self.data.txns.contains(sp.sender))  # check if sender is admin

        # Check if both parties are not part of an escrow transaction yet
        sp.verify(~self.data.partyToAdminMap.contains(owner))
        sp.verify(~self.data.partyToAdminMap.contains(counterparty))

        sp.set_type(owner, sp.TAddress)
        sp.set_type(counterparty, sp.TAddress)
        sp.set_type(fromOwner, sp.TMutez)
        sp.set_type(fromCounterparty, sp.TMutez)
        sp.set_type(epoch, sp.TTimestamp)
        sp.set_type(secret, sp.TBytes)

        self.data.txns[sp.sender].owner = sp.some(owner)
        self.data.txns[sp.sender].counterparty = sp.some(counterparty)
        self.data.txns[sp.sender].fromOwner = fromOwner
        self.data.txns[sp.sender].fromCounterparty = fromCounterparty
        self.data.txns[sp.sender].epoch = epoch
        self.data.txns[sp.sender].hashedSecret = sp.some(sp.blake2b(secret))

        self.data.partyToAdminMap[owner] = sp.sender
        self.data.partyToAdminMap[counterparty] = sp.sender

    @sp.entry_point
    def addBalanceOwner(self):
        sp.verify(
            self.data.partyToAdminMap.contains(sp.sender)
        )  # if sender is part of a txn
        admin = self.data.partyToAdminMap[sp.sender]
        sp.verify(
            ~self.data.txns[admin].escrowWithdrawn
        )  # if the escrow txn isn't withdrawn
        sp.verify(
            ~self.data.txns[admin].ownerWithdrawn
        )  # owner can only deposit if it hasn't withdrawn

        sp.verify(self.data.txns[admin].balanceOwner == sp.tez(0))
        sp.verify(sp.amount == self.data.txns[admin].fromOwner)

        self.data.txns[admin].balanceOwner = self.data.txns[admin].fromOwner

    @sp.entry_point
    def addBalanceCounterparty(self):
        sp.verify(
            self.data.partyToAdminMap.contains(sp.sender)
        )  # if sender is part of a txn
        admin = self.data.partyToAdminMap[sp.sender]
        sp.verify(
            ~self.data.txns[admin].escrowWithdrawn
        )  # if the escrow txn isn't withdrawn
        sp.verify(
            ~self.data.txns[admin].counterpartyWithdrawn
        )  # counterparty can only deposit if it hasn't withdrawn

        sp.verify(self.data.txns[admin].balanceCounterparty == sp.tez(0))
        sp.verify(sp.amount == self.data.txns[admin].fromCounterparty)

        self.data.txns[admin].balanceCounterparty = self.data.txns[
            admin
        ].fromCounterparty

    def claim(self, identity, admin):
        sp.set_type(identity, sp.TAddress)
        sp.set_type(admin, sp.TAddress)

        # can only claim funds if escrow isn't withdrawn
        sp.verify(~self.data.txns[admin].escrowWithdrawn)
        sp.verify(
            ~self.data.txns[admin].ownerWithdrawn
            & ~self.data.txns[admin].counterpartyWithdrawn
        )
        sp.verify(sp.sender == identity)
        sp.send(
            identity,
            self.data.txns[admin].balanceOwner
            + self.data.txns[admin].balanceCounterparty,
        )
        self.data.txns[admin].balanceOwner = sp.tez(0)
        self.data.txns[admin].balanceCounterparty = sp.tez(0)

    @sp.entry_point
    def claimCounterparty(self, secret):
        sp.set_type(secret, sp.TBytes)

        admin = self.data.partyToAdminMap[sp.sender]

        sp.verify(self.data.txns[admin].epoch > sp.now)
        sp.verify(self.data.txns[admin].hashedSecret.open_some() == sp.blake2b(secret))
        self.claim(self.data.txns[admin].counterparty.open_some(), admin)

    @sp.entry_point
    def claimOwner(self):
        admin = self.data.partyToAdminMap[sp.sender]
        sp.verify(~self.data.txns[admin].ownerWithdrawn)
        sp.verify(self.data.txns[admin].epoch < sp.now)
        self.claim(self.data.txns[admin].owner.open_some(), admin)

    @sp.entry_point
    def toggleOwnerWithdrawn(self, withdrawn):
        sp.set_type(withdrawn, sp.TBool)

        admin = self.data.partyToAdminMap[sp.sender]
        sp.verify(sp.sender == self.data.txns[admin].owner.open_some())
        self.data.txns[admin].ownerWithdrawn = withdrawn

    @sp.entry_point
    def toggleCounterpartyWithdrawn(self, withdrawn):
        sp.set_type(withdrawn, sp.TBool)

        admin = self.data.partyToAdminMap[sp.sender]
        sp.verify(sp.sender == self.data.txns[admin].counterparty.open_some())
        self.data.txns[admin].counterpartyWithdrawn = withdrawn

    @sp.entry_point
    def revertFunds(self):
        sp.verify(self.data.txns.contains(sp.sender))  # check if sender is admin
        sp.verify(
            self.data.txns[sp.sender].ownerWithdrawn
            & self.data.txns[sp.sender].counterpartyWithdrawn
        )

        # returns the funds to the respective parties
        sp.send(
            self.data.txns[sp.sender].owner.open_some(),
            self.data.txns[sp.sender].balanceOwner,
        )
        sp.send(
            self.data.txns[sp.sender].counterparty.open_some(),
            self.data.txns[sp.sender].balanceCounterparty,
        )

        self.data.txns[sp.sender].balanceOwner = sp.tez(0)
        self.data.txns[sp.sender].balanceCounterparty = sp.tez(0)
        self.data.txns[sp.sender].escrowWithdrawn = sp.bool(True)

    @sp.entry_point
    def resetTxn(self):
        sp.verify(self.data.txns.contains(sp.sender))
        owner = self.data.txns[sp.sender].owner
        counterparty = self.data.txns[sp.sender].counterparty
        del self.data.partyToAdminMap[owner.open_some()]
        del self.data.partyToAdminMap[counterparty.open_some()]
        self.initTxnData(sp.sender)

    @sp.entry_point
    def hardReset():
        sp.verify(self.data.mainAdmin == sp.sender)
        self.data.txns = {}
        self.data.partyToAdminMap = {}


@sp.add_test(name="Escrow")
def test():
    scenario = sp.test_scenario()
    scenario.h1("Escrow")

    mainAdmin = sp.test_account("MainAdmin").address
    admin = sp.test_account("Admin").address
    alice = sp.test_account("Alice").address
    bob = sp.test_account("Bob").address
    c1 = Escrow(mainAdmin)
    scenario += c1
    # -------------------- FIRST TEST -------------------------------------
    scenario.h2("First test")
    scenario.p("Scenario: Counterparty claims the token before epoch time")
    c1.registerAsAdmin().run(
        sender=admin
    )  # ADMIN MUST REGISTER FIRST BEFORE ANYTHING ELSE
    c1.setTxn(
        owner=alice,
        counterparty=bob,
        fromOwner=sp.tez(50),
        fromCounterparty=sp.tez(50),
        epoch=sp.timestamp(123),
        secret=sp.bytes("0x01223344"),
    ).run(
        sender=admin
    )  # ADMIN MUST SET TXN DATA

    c1.addBalanceOwner().run(sender=alice, amount=sp.tez(50))
    c1.addBalanceCounterparty().run(sender=bob, amount=sp.tez(50))
    scenario.p("Erronous secret")
    c1.claimCounterparty(sp.bytes("0x01223343")).run(
        sender=bob, now=sp.timestamp(120), valid=False
    )
    scenario.p("Correct secret")
    c1.claimCounterparty(sp.bytes("0x01223344")).run(sender=bob, now=sp.timestamp(120))

    c1.resetTxn().run(sender=admin)

    # -------------------- SECOND TEST -------------------------------------
    scenario.h2("Second test")
    scenario.p("Scenario: Owner claims the token after epoch time")
    c1.setTxn(
        owner=alice,
        counterparty=bob,
        fromOwner=sp.tez(40),
        fromCounterparty=sp.tez(40),
        epoch=sp.timestamp(123),
        secret=sp.bytes("0x01223344"),
    ).run(
        sender=admin
    )  # ADMIN MUST SET TXN DATA

    c1.addBalanceOwner().run(sender=alice, amount=sp.tez(40))
    c1.addBalanceCounterparty().run(sender=bob, amount=sp.tez(40))

    # owner can claim tokens after epoch time
    c1.claimOwner().run(sender=alice, now=sp.timestamp(125))

    c1.resetTxn().run(sender=admin)

    # -------------------- THIRD TEST -------------------------------------
    scenario.h2("Third test")
    scenario.p(
        "Scenario: Owner add funds. Counterparty withdrew so owner withdrew too. Admin reverts the funds to the respective parties."
    )
    c1.setTxn(
        owner=alice,
        counterparty=bob,
        fromOwner=sp.tez(30),
        fromCounterparty=sp.tez(30),
        epoch=sp.timestamp(123),
        secret=sp.bytes("0x01223344"),
    ).run(
        sender=admin
    )  # ADMIN MUST SET TXN DATA
    c1.addBalanceOwner().run(sender=alice, amount=sp.tez(30))
    c1.toggleCounterpartyWithdrawn(sp.bool(True)).run(sender=bob)
    c1.toggleOwnerWithdrawn(sp.bool(True)).run(sender=alice)
    c1.revertFunds().run(sender=admin)

    # -------------------- FOURTH TEST -------------------------------------
    scenario.h2("Fourth test")
    scenario.p("Scenario: There is a new admin. New admin sets a new pair of parties.")

    new_admin = sp.test_account("New Admin").address
    charles = sp.test_account("Charles").address
    darwin = sp.test_account("Darwin").address
    c1.registerAsAdmin().run(
        sender=new_admin
    )  # ADMIN MUST REGISTER FIRST BEFORE ANYTHING ELSE
    c1.setTxn(
        owner=charles,
        counterparty=darwin,
        fromOwner=sp.tez(60),
        fromCounterparty=sp.tez(60),
        epoch=sp.timestamp(123),
        secret=sp.bytes("0x01223344"),
    ).run(
        sender=new_admin
    )  # ADMIN MUST SET TXN DATA
    c1.addBalanceOwner().run(sender=charles, amount=sp.tez(60))
    c1.addBalanceCounterparty().run(sender=darwin, amount=sp.tez(60))
    c1.claimCounterparty(sp.bytes("0x01223344")).run(
        sender=darwin, now=sp.timestamp(120)
    )

    c1.resetTxn().run(sender=new_admin)

    c1.hardReset().run(sender=mainAdmin)


sp.add_compilation_target(
    "escrow",
    Escrow(sp.address("tz1i1THJ4MHiqTWsHNcZNU4YT8tPtqZW5NYE")),
)
