import { BeaconWallet } from "@taquito/beacon-wallet";

export const wallet = new BeaconWallet({
  name: "CS 173 Mini-Project 2",
  preferredNetwork: "limanet",
});

export const connectWallet = async () => {
  await wallet.requestPermissions({ network: { type: "limanet" } });
};

export const getAccountAddr = async () => {
  const activeAccount = await wallet.client.getActiveAccount();
  if (activeAccount) {
    return activeAccount.address;
  } else {
    return "";
  }
};
