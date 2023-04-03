import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import ContractDataContext from "../context/contract-data";
import AccountDataContext from "../context/account-data";

const DashboardPage = (props) => {
  const navigate = useNavigate();

  const contractDataContext = useContext(ContractDataContext);
  const accountDataContext = useContext(AccountDataContext);

  useEffect(() => {
    if (accountDataContext.address === "") {
      navigate("/");
    }
  }, [accountDataContext.address]);

  useEffect(() => {
    (async () => await contractDataContext.fetchStorage())();
  }, []);

  useEffect(() => {
    accountDataContext.fetchAccountData(true, contractDataContext.storage);
  }, [contractDataContext]);

  return (
    <>
      <Navbar></Navbar>
      <h6 className="text-center">
        Account Address:{" "}
        <span className="text-success fw-bolder">
          {accountDataContext.address}
        </span>
      </h6>
      <p className="text-center mb-4 text-info fw-bolder">
        ({accountDataContext.type})
      </p>
      {/* <TxnDataTable
        contractStorage={contractStorage}
        contractAddr={contractAddr}
      ></TxnDataTable> */}
      {/* {accountAddr === contractStorage.admin && (
        <div className="container my-5">
          <div className="text-center">
            <h4>Revert Escrow Funds?</h4>
            <p>
              This action will return the funds to their respective parties.
              Only enabled when both parties agreed to withdraw from the
              contract.
            </p>
            <div
              className={
                "btn btn-primary " +
                (contractStorage.ownerWithdrew &&
                contractStorage.counterpartyWithdrew
                  ? ""
                  : "disabled")
              }
            >
              Refund
            </div>
          </div>
        </div>
      )}
      {(accountAddr === contractStorage.owner ||
        accountAddr === contractStorage.counterparty) && (
        <>
          <div className="container my-5">
            <div className="text-center">
              <h4>Withdraw from the escrow?</h4>
              <p>
                This action will withdraw the party from the escrow contract.
              </p>
              <div className="btn btn-primary">Withdraw</div>
            </div>
          </div>
          <div className="container my-5">
            <div className="row text-center">
              <div className="col">
                <h4>Deposit to the escrow.</h4>
                <p>This action will desposit funds to the escrow.</p>
                <div className="mb-3 w-75 mx-auto">
                  <label htmlFor="amount-input" className="form-label">
                    Amount (mutez)
                  </label>
                  <input
                    type="number"
                    className="form-control text-center"
                    id="amount-input"
                    defaultValue={partyInfo.toDeposit}
                    required
                  ></input>
                </div>
                <div className="btn btn-primary">Desposit</div>
              </div>
              <div className="col">
                <h4>Claim funds.</h4>
                <p>This action will claim the funds of the escrow.</p>
                <div className="btn btn-primary">Claim</div>
              </div>
            </div>
          </div>
        </>
      )} */}
    </>
  );
};

export default DashboardPage;
