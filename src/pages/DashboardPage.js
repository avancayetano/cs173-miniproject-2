import React, { useEffect, useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Header from "../components/Header";
import TxnDataTable from "../components/TxnDataTable";
import LoadingButton from "../components/LoadingButton";
import ContractDataContext from "../context/contract-data";
import AccountDataContext from "../context/account-data";
import {
  addBalanceOwner,
  addBalanceCounterparty,
  claimOwner,
  claimCounterparty,
  toggleOwnerWithdrawn,
  toggleCounterpartyWithdrawn,
} from "../utils/operations";

const DashboardPage = () => {
  const navigate = useNavigate();

  const contractDataContext = useContext(ContractDataContext);
  const accountDataContext = useContext(AccountDataContext);

  const [claimLoading, setClaimLoading] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const [partyInfo, setPartyInfo] = useState({});

  const secretRef = useRef();

  useEffect(() => {
    (async () => await contractDataContext.fetchStorage())();
  }, []);

  useEffect(() => {
    if (Object.keys(contractDataContext.storage).length > 0) {
      console.log("dddddddddddddddd");
      (async () => {
        const authenticated = await accountDataContext.fetchAccountData(
          false,
          contractDataContext.storage
        );
        if (!authenticated) {
          navigate("/");
        }
      })();
    }
  }, [contractDataContext]);

  useEffect(() => {
    if (Object.keys(accountDataContext.txnData).length > 0) {
      if (accountDataContext.type === "Owner") {
        setPartyInfo({
          deposit: accountDataContext.txnData.fromOwner,
          balance: accountDataContext.txnData.balanceOwner,
          withdrawn: accountDataContext.txnData.ownerWithdrawn,
        });
      } else if (accountDataContext.type === "Counterparty") {
        setPartyInfo({
          deposit: accountDataContext.txnData.fromCounterparty,
          balance: accountDataContext.txnData.balanceCounterparty,
          withdrawn: accountDataContext.txnData.counterpartyWithdrawn,
        });
      }
    }
  }, [accountDataContext]);

  const onDespositFunds = async () => {
    setDepositLoading(true);
    try {
      if (accountDataContext.type === "Owner") {
        const amount = accountDataContext.txnData.fromOwner;
        await addBalanceOwner(amount);
      } else if (accountDataContext.type === "Counterparty") {
        const amount = accountDataContext.txnData.fromCounterparty;
        await addBalanceCounterparty(amount);
      }
    } catch (err) {
      console.log(err);
    }

    await contractDataContext.fetchStorage();
    setDepositLoading(false);
  };

  const onClaimFunds = async (event) => {
    event.preventDefault();

    setClaimLoading(true);
    try {
      if (accountDataContext.type === "Owner") {
        await claimOwner();
      } else if (accountDataContext.type === "Counterparty") {
        const secret = secretRef.current.value;
        secretRef.current.value = "";
        await claimCounterparty(secret);
      }
    } catch (err) {
      console.log(err);
    }
    await contractDataContext.fetchStorage();
    setClaimLoading(false);
  };

  const onToggleWithdraw = async (withdrawn) => {
    setWithdrawLoading(true);
    try {
      if (accountDataContext.type === "Owner") {
        await toggleOwnerWithdrawn(withdrawn);
      } else if (accountDataContext.type === "Counterparty") {
        await toggleCounterpartyWithdrawn(withdrawn);
      }
    } catch (err) {
      console.log(err);
    }

    await contractDataContext.fetchStorage();
    setWithdrawLoading(false);
  };

  return (
    <>
      <Navbar></Navbar>
      <Header title="Dashboard"></Header>
      {accountDataContext.type === "Owner" ||
      accountDataContext.type === "Counterparty" ? (
        <>
          <TxnDataTable txnData={accountDataContext.txnData}></TxnDataTable>
          <div className="container mb-5">
            <div className="row text-center">
              <div className="col mb-5 border-end">
                <h4 className="mb-3">Desposit Funds</h4>
                <LoadingButton
                  className="btn btn-primary"
                  isLoading={depositLoading}
                  onClick={onDespositFunds}
                  disabled={
                    partyInfo.withdrawn ||
                    partyInfo.balance === partyInfo.deposit
                  }
                >
                  Deposit {parseInt(partyInfo.deposit) / 10 ** 6} tez
                </LoadingButton>
              </div>
              <div className="col mb-5 border-end">
                <h4 className="mb-3">Claim Funds</h4>
                <div className="row text-center">
                  <form autoComplete="off" onSubmit={onClaimFunds}>
                    <div
                      className="col w-100 mb-3 text-center"
                      hidden={accountDataContext.type === "Owner"}
                    >
                      <label htmlFor="secret-form" className="form-label">
                        Enter Secret Key
                      </label>
                      <input
                        type="text"
                        className={"form-control w-75 text-center mx-auto"}
                        id="secret-form"
                        ref={secretRef}
                        pattern="^([a-fA-F0-9][a-fA-F0-9])*$"
                        placeholder={"abcd1234"}
                        defaultValue={
                          accountDataContext.type === "Owner" ? "abcd1234" : ""
                        }
                        title="Only hexadecimal characters allowed ([a-fA-F0-9]). Length should be even."
                        required
                      />
                    </div>
                    <LoadingButton
                      className="btn btn-primary"
                      type="submit"
                      isLoading={claimLoading}
                      disabled={
                        accountDataContext.txnData.ownerWithdrawn ||
                        accountDataContext.txnData.counterpartyWithdrawn ||
                        parseInt(accountDataContext.txnData.balanceOwner) ===
                          0 ||
                        parseInt(
                          accountDataContext.txnData.balanceCounterparty
                        ) === 0 ||
                        (accountDataContext.type === "Owner"
                          ? new Date().getTime() <
                            new Date(accountDataContext.txnData.epoch).getTime()
                          : new Date().getTime() >
                            new Date(
                              accountDataContext.txnData.epoch
                            ).getTime())
                      }
                    >
                      Claim{" "}
                      {(parseInt(accountDataContext.txnData.fromOwner) +
                        parseInt(accountDataContext.txnData.fromCounterparty)) /
                        10 ** 6}{" "}
                      tez
                    </LoadingButton>
                  </form>
                </div>
              </div>
              {partyInfo.withdrawn ? (
                <div className="col mb-5">
                  <h4 className="mb-3">Cancel withdrawal</h4>
                  <LoadingButton
                    className="btn btn-primary"
                    isLoading={withdrawLoading}
                    onClick={() => onToggleWithdraw(false)}
                    disabled={accountDataContext.txnData.escrowWithdrawn}
                  >
                    Cancel Withdraw
                  </LoadingButton>
                </div>
              ) : (
                <div className="col mb-5">
                  <h4 className="mb-3">Withdraw from the escrow</h4>
                  <LoadingButton
                    className="btn btn-primary"
                    isLoading={withdrawLoading}
                    onClick={() => onToggleWithdraw(true)}
                    disabled={accountDataContext.txnData.escrowWithdrawn}
                  >
                    Withdraw
                  </LoadingButton>
                </div>
              )}
            </div>
          </div>
        </>
      ) : accountDataContext.type === "" ? (
        <h2 className="mb-3 text-center">Loading...</h2>
      ) : (
        <h2 className="mb-3 text-center">
          Account is not part of any escrow transaction.
        </h2>
      )}
    </>
  );
};

export default DashboardPage;
