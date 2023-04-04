import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Header from "../components/Header";
import TxnDataTable from "../components/TxnDataTable";
import LoadingButton from "../components/LoadingButton";
import ContractDataContext from "../context/contract-data";
import AccountDataContext from "../context/account-data";
import { setTxn, revertFunds, resetTxn } from "../utils/operations";

const AdminPage = () => {
  const navigate = useNavigate();

  const contractDataContext = useContext(ContractDataContext);
  const accountDataContext = useContext(AccountDataContext);

  const [saveLoading, setSaveLoading] = useState(false);
  const [revertLoading, setRevertLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const ownerRef = useRef();
  const counterpartyRef = useRef();
  const fromOwnerRef = useRef();
  const fromCounterpartyRef = useRef();
  const epochRef = useRef();
  const secretRef = useRef();

  const closeRef = useRef();

  useEffect(() => {
    (async () => await contractDataContext.fetchStorage())();
  }, []);

  useEffect(() => {
    if (Object.keys(contractDataContext.storage).length > 0) {
      (async () => {
        const authenticated = await accountDataContext.fetchAccountData(
          true,
          contractDataContext.storage
        );
        if (!authenticated) {
          navigate("/");
        }
      })();
    }
  }, [contractDataContext]);

  console.log(contractDataContext.storage);

  const submitForm = async (event) => {
    event.preventDefault();
    closeRef.current.click();
    setSaveLoading(true);

    try {
      const owner = ownerRef.current.value;
      const counterparty = counterpartyRef.current.value;
      const fromOwner = parseInt(fromOwnerRef.current.value) * 10 ** 6;
      const fromCounterparty =
        parseInt(fromCounterpartyRef.current.value) * 10 ** 6;
      const epoch = new Date(epochRef.current.value).toISOString();
      const secret = secretRef.current.value;

      await setTxn(
        owner,
        counterparty,
        fromOwner,
        fromCounterparty,
        epoch,
        secret
      );
      await contractDataContext.fetchStorage();
    } catch (err) {
      console.log(err);
    }

    setSaveLoading(false);
  };

  const Form = () => (
    <form autoComplete="off" onSubmit={submitForm}>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Set Escrow Transaction Data
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="row mb-3">
                <div className="col w-50">
                  <label htmlFor="owner-form" className="form-label">
                    Owner
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="owner-form"
                    ref={ownerRef}
                    defaultValue={accountDataContext.txnData.owner || ""}
                    required
                  />
                </div>
                <div className="col w-50">
                  <label htmlFor="counterparty-form" className="form-label">
                    Counterparty
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="counterparty-form"
                    ref={counterpartyRef}
                    defaultValue={accountDataContext.txnData.counterparty || ""}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col w-50">
                  <label htmlFor="from-owner-form" className="form-label">
                    From Owner (tez)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="from-owner-form"
                    ref={fromOwnerRef}
                    defaultValue={(
                      parseInt(accountDataContext.txnData.fromOwner) /
                      10 ** 6
                    ).toString()}
                    required
                  />
                </div>
                <div className="col w-50">
                  <label
                    htmlFor="from-counterparty-form"
                    className="form-label"
                  >
                    From Counterparty (tez)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="from-counterparty-form"
                    ref={fromCounterpartyRef}
                    defaultValue={(
                      parseInt(accountDataContext.txnData.fromCounterparty) /
                      10 ** 6
                    ).toString()}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col w-50">
                  <label htmlFor="epoch-form" className="form-label">
                    Epoch
                  </label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    id="epoch-form"
                    ref={epochRef}
                    required
                  />
                </div>
                <div className="col w-50">
                  <label htmlFor="secret-form" className="form-label">
                    Secret
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="secret-form"
                    ref={secretRef}
                    pattern="^([a-fA-F0-9][a-fA-F0-9])*$"
                    defaultValue={"abcd1234"}
                    title="Only hexadecimal characters allowed ([a-fA-F0-9]). Length should be even."
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={closeRef}
              >
                Close
              </button>
              <button type="submit" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );

  const onRevertFunds = async () => {
    setRevertLoading(true);
    try {
      await revertFunds();
      await contractDataContext.fetchStorage();
    } catch (err) {
      console.log(err);
    }
    setRevertLoading(false);
  };

  const onResetTxn = async () => {
    setResetLoading(true);
    try {
      await resetTxn();
      await contractDataContext.fetchStorage();
    } catch (err) {
      console.log(err);
    }

    setResetLoading(false);
  };

  return (
    <>
      <Navbar></Navbar>
      <Header title="Admin Page"></Header>
      {accountDataContext.type === "Admin" ? (
        <>
          <TxnDataTable txnData={accountDataContext.txnData}></TxnDataTable>
          <div className="container mb-5">
            <div className="row text-center">
              <div className="col mb-5 border-end">
                <h4 className="mb-3"> Set up escrow transaction</h4>
                <p>
                  Set up escrow transaction by editing the entries on the above
                  table.
                </p>
                <LoadingButton
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  isLoading={saveLoading}
                >
                  Set Escrow Data
                </LoadingButton>
              </div>
              <div className="col mb-5 border-end">
                <h4 className="mb-3">Revert Funds.</h4>
                <p>
                  Revert funds to the respective parties (only applicable if
                  both parties agreed to withdraw).
                </p>
                <LoadingButton
                  className="btn btn-primary"
                  onClick={onRevertFunds}
                  disabled={
                    !(
                      accountDataContext.txnData.ownerWithdrawn &&
                      accountDataContext.txnData.counterpartyWithdrawn
                    )
                  }
                  isLoading={revertLoading}
                >
                  Revert Funds
                </LoadingButton>
              </div>
              <div className="col mb-5">
                <h4 className="mb-3">Reset Transaction.</h4>
                <p>
                  This will reset the entire transaction (i.e. erase all the
                  entries on the above table).
                </p>
                <LoadingButton
                  className="btn btn-primary"
                  onClick={onResetTxn}
                  isLoading={resetLoading}
                >
                  Reset
                </LoadingButton>
              </div>
            </div>
          </div>
          <Form></Form>
        </>
      ) : (
        <h2 className="mb-3 text-center">
          Unauthorized. Account is not an admin.
        </h2>
      )}
    </>
  );
};

export default AdminPage;
