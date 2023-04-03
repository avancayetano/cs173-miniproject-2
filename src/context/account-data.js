import { createContext, useState } from "react";

import { getAccountAddr } from "../utils/wallet";

const AccountDataContext = createContext({
  address: "",
  type: "",
  txnData: {},
  setAddress: async () => {},
  setType: (isAdmin) => {},
  setTxnData: (contractStorage) => {},
  fetchAccountData: async () => {},
  resetAccountData: () => {},
});

export function AccountDataContextProvider(props) {
  const [address, setAddress] = useState("");
  const [type, setType] = useState("");
  const [txnData, setTxnData] = useState({});

  const setAddressHandler = async () => {
    const address = await getAccountAddr();
    setAddress(address);
  };

  const setTypeHandler = (isAdmin) => {
    if (isAdmin) {
      setType("Admin");
    } else {
      if (Object.keys(txnData).length > 0) {
        if (address === txnData.owner) {
          setType("Owner");
        } else if (address === txnData.counterparty) {
          setType("Counterparty");
        }
      } else {
        setType("User");
      }
    }
  };

  const setTxnDataHandler = (contractStorage) => {
    console.log("cccccccccccc");
    console.log(address);
    const admin = contractStorage.partyToAdminMap[address] || "";
    const txnData = contractStorage.txns[admin] || {};
    setTxnData(txnData);
  };

  const fetchAccountDataHandler = async (isAdmin, contractStorage) => {
    const address = await getAccountAddr();
    if (address === "") {
      return false;
    }
    setAddress(address);
    if (isAdmin) {
      const txnData = contractStorage.txns[address];
      setTxnData({ ...txnData, admin: address });
      setType("Admin");
    } else {
      const admin = contractStorage.partyToAdminMap[address] || "";
      const txnData = contractStorage.txns[admin] || {};
      setTxnData({ ...txnData, admin: admin });

      if (Object.keys(txnData).length > 0) {
        if (address === txnData.owner) {
          setType("Owner");
        } else if (address === txnData.counterparty) {
          setType("Counterparty");
        }
      } else {
        setType("User");
      }
    }
    return true;
  };

  const resetAccountDataHandler = () => {
    setAddress("");
    setType("");
    setTxnData({});
  };

  const context = {
    address: address,
    type: type,
    txnData: txnData,
    setAddress: setAddressHandler,
    setType: setTypeHandler,
    setTxnData: setTxnDataHandler,
    fetchAccountData: fetchAccountDataHandler,
    resetAccountData: resetAccountDataHandler,
  };

  return (
    <AccountDataContext.Provider value={context}>
      {props.children}
    </AccountDataContext.Provider>
  );
}

export default AccountDataContext;
