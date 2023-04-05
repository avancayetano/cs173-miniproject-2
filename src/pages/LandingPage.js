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

  const [currentTxns, setCurrentTxns] = useState([]);

  useEffect(() => {
    accountDataContext.resetAccountData();
    (async () => await contractDataContext.fetchStorage())();
  }, []);

  useEffect(() => {
    if (Object.keys(contractDataContext.storage).length > 0) {
      setCurrentTxns([
        ...new Set(Object.values(contractDataContext.storage.partyToAdminMap)),
      ]);
    }
  }, [contractDataContext]);

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
              Anyone can register as an admin (via the{" "}
              <kbd>Log In as Admin</kbd> button). Once registered, the admin can
              set up an escrow transaction (only one transaction per admin) by
              setting up the two parties (Owner and Counterparty), as well as
              other relevant transaction data. This can be done via the{" "}
              <kbd>Set Escrow Data</kbd> button. The reasoning behind having
              multiple admins is so that you can test this dapp on your own. You
              can log in as an admin and setup your own escrow transaction. This
              would allow the dapp to have multiple concurrent escrow
              transactions.
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
              Both the Owner and Counterparty can withdraw (i.e. back out of)
              the escrow via the <kbd>Withdraw</kbd> button. Both can also
              cancel their withdrawal via the <kbd>Cancel Withdraw</kbd> button.
            </li>
            <li>
              Only when both of the parties agree to withdraw (via the{" "}
              <kbd>Withdraw</kbd> button) can the admin revert the funds via the{" "}
              <kbd>Revert Funds</kbd> button. When the admin clicks the{" "}
              <kbd>Revert Funds</kbd> button, owner will receive whatever{" "}
              <code>balanceOwner</code> is and counterparty will receive{" "}
              <code>balanceCounterparty</code>. Moreover, both parties can no
              longer deposit funds nor claim the funds.
            </li>
            <li>
              An admin can also reset an escrow transaction via the{" "}
              <kbd>Reset</kbd> button. This will erase the Owner and
              Counterparty from the escrow transaction, as well as the other
              relevant transaction data (<code>fromOwner</code>,{" "}
              <code>fromCounterparty</code>, <code>epoch</code>,{" "}
              <code>secret</code>, etc).
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
      <div className="container my-5">
        <div className="text-center">
          <h3>All current escrow transactions</h3>
        </div>
        {Object.keys(contractDataContext.storage).length > 0 &&
          (currentTxns.length > 0 ? (
            currentTxns.map((admin) => (
              <div key={admin} className="">
                <TxnDataTable
                  txnData={{
                    ...contractDataContext.storage.txns[admin],
                    admin,
                  }}
                ></TxnDataTable>
              </div>
            ))
          ) : (
            <h4 className="text-center">
              There are currently no escrow transactions.
            </h4>
          ))}
      </div>
    </>
  );
};

export default LandingPage;
