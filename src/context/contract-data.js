import { createContext, useState } from "react";

import { fetchContractStorage } from "../utils/tzkt";

const ContractDataContext = createContext({
  storage: {},
  fetchStorage: async () => {},
});

export function ContractDataContextProvider(props) {
  const [storage, setStorage] = useState({});

  const fetchStorage = async () => {
    const storage = await fetchContractStorage();
    setStorage(storage);
  };

  const context = {
    storage: storage,
    fetchStorage: fetchStorage,
  };

  return (
    <ContractDataContext.Provider value={context}>
      {props.children}
    </ContractDataContext.Provider>
  );
}

export default ContractDataContext;
