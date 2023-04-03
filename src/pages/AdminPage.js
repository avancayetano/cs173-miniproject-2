import React, { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Header from "../components/Header";
import TxnDataTable from "../components/TxnDataTable";
import ContractDataContext from "../context/contract-data";
import AccountDataContext from "../context/account-data";
import { setTxn } from "../utils/operations";

const AdminPage = () => {
  const navigate = useNavigate();

  const contractDataContext = useContext(ContractDataContext);
  const accountDataContext = useContext(AccountDataContext);

  const ownerRef = useRef();
  const counterpartyRef = useRef();
  const fromOwnerRef = useRef();
  const fromCounterpartyRef = useRef();
  const epochRef = useRef();
  const secretRef = useRef();

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
  }, [contractDataContext.storage]);

  console.log(accountDataContext);

  const submitForm = async () => {
    const owner = ownerRef.current.value;
    const counterparty = counterpartyRef.current.value;
    const fromOwner = parseInt(fromOwnerRef.current.value);
    const fromCounterparty = parseInt(fromCounterpartyRef.current.value);
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
  };

  const Form = () => (
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
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col w-50">
                <label htmlFor="from-owner-form" className="form-label">
                  From Owner (mutez)
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="from-owner-form"
                  ref={fromOwnerRef}
                />
              </div>
              <div className="col w-50">
                <label htmlFor="from-counterparty-form" className="form-label">
                  From Counterparty (mutez)
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="from-counterparty-form"
                  ref={fromCounterpartyRef}
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
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              onClick={submitForm}
              type="button"
              className="btn btn-primary"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <>
      <Navbar></Navbar>
      <Header></Header>
      <TxnDataTable txnData={accountDataContext.txnData}></TxnDataTable>
      <div className="text-center">
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Set Escrow Data
        </button>
      </div>
      <Form></Form>
    </>
  );
};

export default AdminPage;
