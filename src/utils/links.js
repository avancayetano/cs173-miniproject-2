import { network, contractAddr } from "./wallet";

export const getContractAddressLink = () => {
  return `https://${network}.tzkt.io/${contractAddr}/operations/`;
};

export const getAccountAddressLink = (address) => {
  return `https://${network}.tzkt.io/${address}/operations/`;
};
