# Escrow - Example for illustrative purposes only.

import smartpy as sp

class Escrow(sp.Contract):
    def __init__(self, owner, fromOwner, counterparty, fromCounterparty, admin, epoch, hashedSecret):
        self.init(fromOwner            = fromOwner,
                  fromCounterparty     = fromCounterparty,
                  balanceOwner         = sp.tez(0),
                  balanceCounterparty  = sp.tez(0),
                  hashedSecret         = hashedSecret,
                  epoch                = epoch,
                  owner                = owner,
                  counterparty         = counterparty,
                  admin                = admin,             # admin
                  ownerWithdrew        = sp.bool(False),    # indicates whether owner withdrew
                  counterpartyWithdrew = sp.bool(False),    # indicates whether counterparty withdrew
                 )

    @sp.entry_point
    def addBalanceOwner(self):
        sp.verify(~self.data.ownerWithdrew)    # owner can only deposit if it hasn't withdrawn
        sp.verify(self.data.balanceOwner == sp.tez(0))
        sp.verify(sp.amount == self.data.fromOwner)
        self.data.balanceOwner = self.data.fromOwner

    @sp.entry_point
    def addBalanceCounterparty(self):
        sp.verify(~self.data.counterpartyWithdrew)    # counterparty can only deposit if it hasn't withdrawn
        sp.verify(self.data.balanceCounterparty == sp.tez(0))
        sp.verify(sp.amount == self.data.fromCounterparty)
        self.data.balanceCounterparty = self.data.fromCounterparty

    def claim(self, identity):
        # can only claim funds if both parties haven't withdrawn
        sp.verify(~self.data.ownerWithdrew & ~self.data.counterpartyWithdrew)
        sp.verify(sp.sender == identity)
        sp.send(identity, self.data.balanceOwner + self.data.balanceCounterparty)
        self.data.balanceOwner = sp.tez(0)
        self.data.balanceCounterparty = sp.tez(0)

    @sp.entry_point
    def claimCounterparty(self, params):
        sp.verify(self.data.epoch < sp.now)
        sp.verify(self.data.hashedSecret == sp.blake2b(params.secret))
        self.claim(self.data.counterparty)

    @sp.entry_point
    def claimOwner(self):
        sp.verify(self.data.epoch < sp.now)
        self.claim(self.data.owner)


    @sp.entry_point
    def withdrawOwner(self):
        sp.verify(sp.sender == self.data.owner)
        self.data.ownerWithdrew = sp.bool(True)

    @sp.entry_point
    def withdrawCounterparty(self):
        sp.verify(sp.sender == self.data.counterparty)
        self.data.counterpartyWithdrew = sp.bool(True)

    @sp.entry_point
    def refund(self):
        
        sp.verify(sp.sender == self.data.admin)
        sp.verify(self.data.ownerWithdrew & self.data.counterpartyWithdrew)

        # returns the funds to the respective parties
        sp.send(self.data.owner, self.data.balanceOwner)
        sp.send(self.data.counterparty, self.data.balanceCounterparty)

        # resets the escrow contract
        self.data.balanceOwner = sp.tez(0)
        self.data.balanceCounterparty = sp.tez(0)
        self.data.ownerWithdrew = sp.bool(False)
        self.data.counterpartyWithdrew = sp.bool(False)
        
        

@sp.add_test(name = "Escrow")
def test():
    scenario = sp.test_scenario()
    scenario.h1("Escrow")
    hashSecret = sp.blake2b(sp.bytes("0x01223344"))
    admin = sp.test_account("admin")
    alice = sp.test_account("Alice")
    bob = sp.test_account("Bob")
    c1 = Escrow(alice.address, sp.tez(50), bob.address, sp.tez(4), admin.address, sp.timestamp(123), hashSecret)
    scenario += c1
    c1.addBalanceOwner().run(sender = alice, amount = sp.tez(50))
    c1.addBalanceCounterparty().run(sender = bob, amount = sp.tez(4))
    scenario.h3("Erronous secret")
    c1.claimCounterparty(secret = sp.bytes("0x01223343")).run(sender = bob, now = sp.timestamp(124), valid = False)
    scenario.h3("Correct secret")
    c1.claimCounterparty(secret = sp.bytes("0x01223344")).run(sender = bob, now = sp.timestamp(124))

    # another test
    scenario.h2("Another scenario: Both parties withdraw after both of them deposited...")
    c1.addBalanceOwner().run(sender = alice, amount = sp.tez(50))
    c1.withdrawOwner().run(sender = alice)
    
    c1.addBalanceCounterparty().run(sender = bob, amount = sp.tez(4))
    c1.withdrawCounterparty().run(sender = bob)

    c1.refund().run(sender = admin)

    # another test
    scenario.h2("Another scenario: Both parties withdraw after one of them deposited...")    
    c1.withdrawOwner().run(sender = alice)

    c1.addBalanceCounterparty().run(sender = bob, amount = sp.tez(4))
    c1.withdrawCounterparty().run(sender = bob)

    c1.refund().run(sender = admin)

    # another test
    scenario.h2("Another scenario: One tries to claim the funds when the other has withdrawn")    
    c1.withdrawOwner().run(sender = alice)

    c1.addBalanceCounterparty().run(sender = bob, amount = sp.tez(4))
    c1.claimCounterparty(secret = sp.bytes("0x01223344")).run(sender = bob, now = sp.timestamp(124), valid = False)

    c1.withdrawCounterparty().run(sender = bob)

    c1.refund().run(sender = admin)


    # another test
    scenario.h2("Another scenario: Admin tries to refund when only one has agreed to withdraw")    
    c1.withdrawOwner().run(sender = alice)

    c1.addBalanceCounterparty().run(sender = bob, amount = sp.tez(4))

    c1.refund().run(sender = admin, valid = False)

    scenario.h2("Another scenario: Owner tries to deposit even when it has withdrawn")    
    c1.addBalanceOwner().run(sender = alice, amount = sp.tez(50), valid = False)

    scenario.h2("Another scenario: Non-admin tries to refund")
    c1.refund().run(sender = bob, valid = False)

    scenario.h2("Valid refund")
    c1.withdrawCounterparty().run(sender = bob)
    c1.refund().run(sender = admin)
    

sp.add_compilation_target("escrow", Escrow(sp.address("tz1i1THJ4MHiqTWsHNcZNU4YT8tPtqZW5NYE"), sp.tez(20), sp.address("tz1MJpn4TVxcWxJ2DpxEJ98jsHGp21H4Jw3B"), sp.tez(5), sp.address("tz1Ty8N3BJ5SdBnesLtvVeMe4yRc2bgWxmTG"), sp.timestamp(1680117691), sp.bytes("0xc2e588e23a6c8b8192da64af45b7b603ac420aefd57cc1570682350154e9c04e")))
