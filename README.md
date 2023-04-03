# CS 173 Mini-project 2

Contract address: `KT1JLa3auBxnV4yjyxXMTa7iG3cZLEPk9EZY`

Contract deployed on Ghostnet.

Key assumptions:

1. The two parties (owner and counterparty) can't be changed once the contract is deployed, that is, whoever the two accounts stored in the storage are the only ones that can participate in the escrow. This means that once I deploy my dapp, only I can claim and deposit because only I have access to the accounts used in the escrow contract.

2. Owner and Counterparty can deposit funds to the escrow via the addBalanceOwner and addBalanceCounterparty entrypoints respectively. The amount of tezos the owner and counterparty can deposit are `fromOwner` and `fromCounterparty`, respectively, and that these values are fixed and can't be changed.

3. One of the two parties can claim the _total_ funds of the escrow (where _total_ funds = `balanceOwner` + `balanceCounterparty`). Owner can claim the _total_ funds via the claimOwner entrypoint while counterparty via the claimCounterparty entrypoint. However, only the Counterparty is required to provide the secret key when claiming.

4. The owner or counterparty can only claim the _total_ funds _after_ the epoch time. (I'm assuming that there is a mistake in the claimCounterparty entrypoint, (it should be `sp.verify(self.data.epoch < sp.now)` just like in the claimOwner entrypoint)).

5. Only when both of the parties agree to withdraw (back out of the escrow) can the admin initiate the fund reversion process. After the admin has authorized the withdrawal, owner will receive whatever `balanceOwner` is and counterparty will receive `balanceCounterparty` (note that this behavior is different from claiming, because claiming claims the _total_ funds). Moreover, after the withdrawal was authorized, both parties can no longer deposit funds nor claim the funds and hence, the other existing entrypoints should no longer work (I'm guessing this is what you meant by "modifying the existing entry points to include a check for whether the admin has authorized the withdrawal.")
