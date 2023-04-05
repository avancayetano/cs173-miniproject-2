import { tezos } from "./tezos";
import { contractAddr } from "./wallet";

export const registerAsAdmin = async () => {
  try {
    const contractInstance = await tezos.wallet.at(contractAddr);
    const op = await contractInstance.methods.registerAsAdmin().send();
    await op.confirmation(3);
  } catch (err) {
    throw err;
  }
};

export const setTxn = async (
  owner,
  counterparty,
  fromOwner,
  fromCounterparty,
  epoch,
  secret
) => {
  try {
    const contractInstance = await tezos.wallet.at(contractAddr);
    const op = await contractInstance.methodsObject
      .setTxn({
        owner,
        counterparty,
        fromOwner,
        fromCounterparty,
        epoch,
        secret,
      })
      .send();
    await op.confirmation(3);
  } catch (err) {
    throw err;
  }
};

export const revertFunds = async () => {
  try {
    const contractInstance = await tezos.wallet.at(contractAddr);
    const op = await contractInstance.methods.revertFunds().send();
    await op.confirmation(3);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const toggleOwnerWithdrawn = async (withdrawn) => {
  try {
    const contractInstance = await tezos.wallet.at(contractAddr);
    const op = await contractInstance.methods
      .toggleOwnerWithdrawn(withdrawn)
      .send();
    await op.confirmation(3);
  } catch (err) {
    throw err;
  }
};

export const toggleCounterpartyWithdrawn = async (withdrawn) => {
  try {
    const contractInstance = await tezos.wallet.at(contractAddr);
    const op = await contractInstance.methods
      .toggleCounterpartyWithdrawn(withdrawn)
      .send();
    await op.confirmation(3);
  } catch (err) {
    throw err;
  }
};

export const addBalanceOwner = async (amount) => {
  try {
    const contractInstance = await tezos.wallet.at(contractAddr);
    const op = await contractInstance.methods.addBalanceOwner().send({
      amount,
      mutez: true,
    });
    await op.confirmation(3);
  } catch (err) {
    throw err;
  }
};

export const addBalanceCounterparty = async (amount) => {
  try {
    const contractInstance = await tezos.wallet.at(contractAddr);
    const op = await contractInstance.methods.addBalanceCounterparty().send({
      amount,
      mutez: true,
    });
    await op.confirmation(3);
  } catch (err) {
    throw err;
  }
};

export const resetTxn = async () => {
  try {
    const contractInstance = await tezos.wallet.at(contractAddr);
    const op = await contractInstance.methods.resetTxn().send();
    await op.confirmation(3);
  } catch (err) {
    throw err;
  }
};

export const claimOwner = async () => {
  try {
    const contractInstance = await tezos.wallet.at(contractAddr);
    const op = await contractInstance.methods.claimOwner().send();
    await op.confirmation(3);
  } catch (err) {
    throw err;
  }
};

export const claimCounterparty = async (secret) => {
  try {
    const contractInstance = await tezos.wallet.at(contractAddr);
    const op = await contractInstance.methods.claimCounterparty(secret).send();
    await op.confirmation(3);
  } catch (err) {
    throw err;
  }
};
