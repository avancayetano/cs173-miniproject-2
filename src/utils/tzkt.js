import axios from "axios";

export const fetchContractStorage = async (contractAddr) => {
  const res = await axios.get(
    `https://api.limanet.tzkt.io/v1/contracts/${contractAddr}/storage`
  );
  return res.data;
};
