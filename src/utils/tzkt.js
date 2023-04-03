import axios from "axios";

import { network, contractAddr } from "./wallet";

export const fetchContractStorage = async () => {
  const res = await axios.get(
    `https://api.${network}.tzkt.io/v1/contracts/${contractAddr}/storage`
  );
  return res.data;
};
