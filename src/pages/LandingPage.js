import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { connectWallet, contractAddr, getAccountAddr } from "../utils/wallet";
import { registerAsAdmin } from "../utils/operations";
import Navbar from "../components/Navbar";
import LoadingButton from "../components/LoadingButton";
import TxnDataTable from "../components/TxnDataTable";
import ContractDataContext from "../context/contract-data";
import AccountDataContext from "../context/account-data";
import { getContractAddressLink } from "../utils/links";

const LandingPage = (props) => {
  const navigate = useNavigate();
  const contractDataContext = useContext(ContractDataContext);
  const accountDataContext = useContext(AccountDataContext);

  const [adminLoginLoading, setAdminLoginLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    accountDataContext.resetAccountData();
    (async () => await contractDataContext.fetchStorage())();
  }, []);

  const onConnectWallet = async (isAdmin) => {
    if (isAdmin) {
      setAdminLoginLoading(true);
    } else {
      setLoginLoading(true);
    }

    try {
      await connectWallet();
      if (isAdmin) {
        const accountAddr = await getAccountAddr();
        if (
          !Object.keys(contractDataContext.storage.txns).includes(accountAddr)
        ) {
          await registerAsAdmin();
        }
        await accountDataContext.fetchAccountData(
          true,
          contractDataContext.storage
        );
        setAdminLoginLoading(false);
        navigate("/admin");
      } else {
        await accountDataContext.fetchAccountData(
          false,
          contractDataContext.storage
        );
        setLoginLoading(false);
        navigate("/dashboard");
      }
    } catch (err) {
      console.log(err);
    }
    setAdminLoginLoading(false);
    setLoginLoading(false);
  };

  console.log(contractDataContext.storage);
  try {
    console.log([
      ...new Set(Object.values(contractDataContext.storage.partyToAdminMap)),
    ]);
  } catch (err) {}

  return (
    <>
      <Navbar
        accountAddr={props.accountAddr}
        setAccountAddr={props.setAccountAddr}
      ></Navbar>
      <h1 className="text-center">An Escrow Contract Project</h1>
      <h4 className="text-center mb-4">by Anthony Van Cayetano</h4>
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
      <div className="container my-5">
        <div className="row text-center">
          <div className="col border-end">
            <h4>Create an Escrow Transaction</h4>
            <p>
              To create an escrow transaction, you need to log in as an admin.
            </p>
            <LoadingButton
              onClick={() => onConnectWallet(true)}
              className="btn btn-primary"
              isLoading={adminLoginLoading}
            >
              Log In as Admin
            </LoadingButton>
          </div>
          <div className="col">
            <h4>Log In</h4>
            <p>To view your escrow transactions, log in as a normal user.</p>
            <LoadingButton
              onClick={() => onConnectWallet(false)}
              className="btn btn-primary"
              isLoading={loginLoading}
            >
              Log In
            </LoadingButton>
          </div>
        </div>
      </div>
      <div className="container my-5">
        <h3 className="text-center">Specifications and Assumptions</h3>
        <div className="">
          <ul className="w-75 mx-auto">
            <li>
              Anyone can be register as an admin (via the{" "}
              <kbd>Log In as Admin</kbd> button). Once registered, the admin can
              set up an escrow transaction (only one transaction) by setting up
              the two parties (Owner and Counterparty), as well as the relevant
              transaction data (owner address, counterparty address,{" "}
              <code>fromOwner</code>, <code>fromCounterparty</code>,{" "}
              <code>epoch</code> and <code>secret</code>). Note that the{" "}
              <code>secret</code> value should be in hexadecimal format without
              the prefix <code>0x</code> (e.g. <code>abcd1234</code>).
            </li>
            <li>
              Non-admin users (who can be either Owner or Counterparty) should
              log in via the <kbd>Log In</kbd> button to view their escrow
              transactions.
            </li>
            <li>
              Owner and Counterparty can deposit funds to the escrow via the{" "}
              <kbd>Deposit</kbd> button, which will call the{" "}
              <code>addBalanceOwner</code> and{" "}
              <code>addBalanceCounterparty</code> entrypoints respectively. The
              amount of tezos the owner and counterparty can deposit are{" "}
              <code>fromOwner</code> and <code>fromCounterparty</code>,
              respectively. These values can be updated by the admin.
            </li>
            <li>
              One of the two parties can claim the total funds of the escrow
              (where total funds = <code>balanceOwner</code> +{" "}
              <code>balanceCounterparty</code>) via the <kbd>Claim</kbd> button,
              which calls the <code>claimOwner</code> or the{" "}
              <code>claimCounterparty</code> entrypoint. However, only the
              Counterparty is required to provide the <code>secret</code> key
              when claiming.
            </li>
            <li>
              Owner can only claim the total funds <i>after</i> the{" "}
              <code>epoch</code> time while counterparty can only claim{" "}
              <i>before</i> (this is assuming both parties have already
              deposited.).
            </li>
            <li>
              Only when both of the parties agree to withdraw (back out of the
              escrow) (via the <kbd>Withdraw</kbd> button) can the admin
              initiate the fund reversion process. After the admin has
              authorized the withdrawal, owner will receive whatever
              <code>balanceOwner</code> is and counterparty will receive{" "}
              <code>balanceCounterparty</code>. Moreover, after the withdrawal
              was authorized (and the funds reverted), both parties can no
              longer deposit funds nor claim the funds and hence, the other
              existing entrypoints should no longer work.
            </li>
          </ul>
        </div>
        <div className="row">
          <div className="text-center">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/avancayetano/cs173-miniproject-2"
              className="btn btn-primary"
            >
              View Source Code
            </a>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="text-center">
          <h3>All current escrow transactions</h3>
        </div>
        {Object.keys(contractDataContext.storage).length > 0 &&
          [
            ...new Set(
              Object.values(contractDataContext.storage.partyToAdminMap)
            ),
          ].map((admin) => (
            <div key={admin} className="">
              <TxnDataTable
                txnData={{ ...contractDataContext.storage.txns[admin], admin }}
              ></TxnDataTable>
            </div>
          ))}
      </div>
    </>
  );
};

export default LandingPage;
