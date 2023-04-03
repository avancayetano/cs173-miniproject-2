import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { connectWallet } from "../utils/wallet";
import { registerAsAdmin } from "../utils/operations";
import Navbar from "../components/Navbar";
import ContractDataContext from "../context/contract-data";
import AccountDataContext from "../context/account-data";

const LandingPage = (props) => {
  const navigate = useNavigate();
  const [connecting, setConnecting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const contractDataContext = useContext(ContractDataContext);
  const accountDataContext = useContext(AccountDataContext);

  useEffect(() => {
    accountDataContext.resetAccountData();
    (async () => await contractDataContext.fetchStorage())();
  }, []);

  useEffect(() => {
    if (connecting) {
      const storage = contractDataContext.storage;
      const accountAddr = accountDataContext.address;
      if (isAdmin) {
        if (!Object.keys(storage.txns).includes(accountAddr)) {
          registerAsAdmin();
        }
        setConnecting(false);
        navigate("/admin");
      } else {
        setConnecting(false);
        navigate("/dashboard");
      }
    }
  }, [accountDataContext]);

  const onConnectWallet = async (isAdmin) => {
    await connectWallet();
    await accountDataContext.setAddress();
    await accountDataContext.fetchAccountData(
      isAdmin,
      contractDataContext.storage
    );
    setConnecting(true);
    setIsAdmin(isAdmin);
  };

  return (
    <>
      <Navbar
        accountAddr={props.accountAddr}
        setAccountAddr={props.setAccountAddr}
      ></Navbar>
      <h1 className="text-center">An Escrow Contract Project</h1>
      <h4 className="text-center mb-4">by Anthony Van Cayetano</h4>
      <div className="container my-5">
        <div className="row text-center">
          <div className="col">
            <h4>Create an Escrow Transaction</h4>
            <p>
              To create an escrow transaction, you need to log in as an admin.
            </p>
            <div
              onClick={() => onConnectWallet(true)}
              className="btn btn-primary"
            >
              Log In as Admin
            </div>
          </div>
          <div className="col">
            <h4>Log In</h4>
            <p>To view your escrow transactions, log in as a normal user.</p>
            <div
              onClick={() => onConnectWallet(false)}
              className="btn btn-primary"
            >
              Log In
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
