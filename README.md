# CS 173 Mini-project 2

Contract address: `KT1EUWtC9Uh6MMr2oYaG9hKnrF6eaAXKTzpJ`

Contract deployed on Limanet.

Key assumptions:

1. Owner is the Escrow contract owner (not the admin).

2. Admin may be different from the owner and is not the creator of the contract.

3. Owner and Counterparty can deposit funds to the escrow via the addBalanceOwner and addBalanceCounterparty entrypoints _respectively_.

4. Moreover, one of the two parties can claim the _total_ funds of the escrow. Owner can claim the funds via the claimOwner entrypoint while counterparty via the claimCounterparty entrypoint. However, only the Counterparty is required to provide the secret key when claiming.

5. The owner or counterparty can only claim the funds after the epoch time. (I'm assuming that there is a mistake in the claimCounterparty entrypoint, (it should be `sp.verify(self.data.epoch < sp.now)` just like in the claimOwner entrypoint)).

6. Only when both of the parties withdraw can the admin initiate the fund reversion process. Escrow contract resets after the withdrawal was authorized.
