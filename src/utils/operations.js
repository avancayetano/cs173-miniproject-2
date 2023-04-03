import { tezos } from "./tezos";
import { contractAddr } from "./wallet";

export const registerAsAdmin = async () => {
  try {
    const contractInstance = await tezos.wallet.at(contractAddr);
    const op = await contractInstance.methods.registerAsAdmin().send();
    await op.confirmation(1);
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
    await op.confirmation(1);
  } catch (err) {
    throw err;
  }
};
