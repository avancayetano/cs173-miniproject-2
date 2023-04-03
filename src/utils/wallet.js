import { BeaconWallet } from "@taquito/beacon-wallet";

export const network = "ghostnet";
export const contractAddr = "KT1JLa3auBxnV4yjyxXMTa7iG3cZLEPk9EZY";

export const wallet = new BeaconWallet({
  name: "CS 173 Mini-Project 2",
  preferredNetwork: network,
});

export const connectWallet = async () => {
  await wallet.requestPermissions({ network: { type: network } });
};

export const getAccountAddr = async () => {
  const activeAccount = await wallet.client.getActiveAccount();
  if (activeAccount) {
    return activeAccount.address;
  } else {
    return "";
  }
};
