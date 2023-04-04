import { BeaconWallet } from "@taquito/beacon-wallet";

export const network = "ghostnet";
export const contractAddr = "KT18r1q7Urm1WwyxJw5xg6Dh2iuH4wUDinta";

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
