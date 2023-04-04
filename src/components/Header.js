import React, { useContext } from "react";

import { network, contractAddr } from "../utils/wallet";
import AccountDataContext from "../context/account-data";
import { getContractAddressLink, getAccountAddressLink } from "../utils/links";

const Header = (props) => {
  const accountDataContext = useContext(AccountDataContext);
  return (
    <>
      <h1 className="text-center mb-5">{props.title}</h1>
      <h5 className="text-center">
        Account Address:{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={getAccountAddressLink(accountDataContext.address)}
        >
          {accountDataContext.address}
        </a>
      </h5>
      <h6 className="text-center mb-4">({accountDataContext.type})</h6>
      <h5 className="text-center">
        Contract Address:{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={getContractAddressLink()}
        >
          {contractAddr}
        </a>
      </h5>
      <h6 className="text-center mb-4">({network})</h6>
    </>
  );
};

export default Header;
