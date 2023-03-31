# CS 173 Mini-project 2

Contract address: `KT1EUWtC9Uh6MMr2oYaG9hKnrF6eaAXKTzpJ`

Contract deployed on Limanet.

Key assumptions:

1. Owner is the Escrow contract owner (not the admin). In other words, owner should be the one to deploy the contract. Or does it not matter?

2. The two parties can't be changed once the contract is deployed. 

3. Owner and Counterparty can deposit funds to the escrow via the addBalanceOwner and addBalanceCounterparty entrypoints _respectively_.

4. Moreover, one of the two parties can claim the _total_ funds of the escrow (_total_ funds = balanceOwner + balanceCounterparty). Owner can claim the _total_ funds via the claimOwner entrypoint while counterparty via the claimCounterparty entrypoint. However, only the Counterparty is required to provide the secret key when claiming.

5. The owner or counterparty can only claim the _total_ funds _after_ the epoch time. (I'm assuming that there is a mistake in the claimCounterparty entrypoint, (it should be `sp.verify(self.data.epoch < sp.now)` just like in the claimOwner entrypoint)).

6. Only when both of the parties agreed to withdraw can the admin initiate the fund reversion process. After the admin has authorized the withdrawal, owner will receive whatever balanceOwner is and counterparty will receive balanceCounterparty (note that this behavior is different from claiming, because claiming claims the _total_ funds). Moreover, after the withdrawal was authorized, both parties can no longer deposit funds nor claim the funds and hence, the other existing entrypoints should no longer work (I'm guessing this is what you meant by "modifying the existing entry points to include a check for whether the admin has authorized the withdrawal.")
