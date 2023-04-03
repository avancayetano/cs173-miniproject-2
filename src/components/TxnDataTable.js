import React from "react";

import { network, contractAddr } from "../utils/wallet";

const TxnDataTable = (props) => {
  const txnData = props.txnData;

  return (
    <div className="container my-5">
      {/* <h4 className="text-center">Contract storage</h4>
      <h6 className="text-center">
        <a
          href={`https://${network}.tzkt.io/${contractAddr}/operations/`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {props.contractAddr}
        </a>
      </h6> */}
      <table className="table mb-5">
        <thead>
          <tr>
            <th scope="col">Admin</th>
            <th scope="col">Owner</th>
            <th scope="col">Counterparty</th>
            <th scope="col">Epoch</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{txnData.admin}</td>
            <td>{txnData.owner || "None"}</td>
            <td>{txnData.counterparty || "None"}</td>
            <td>{txnData.epoch}</td>
          </tr>
        </tbody>
      </table>
      <div className="row">
        <div className="col border-end">
          <h5 className="text-center">Owner</h5>
          <table className="table">
            <tbody>
              <tr>
                <td>From Owner (mutez)</td>
                <td>{txnData.fromOwner}</td>
              </tr>
              <tr>
                <td>Balance (mutez)</td>
                <td>{txnData.balanceOwner}</td>
              </tr>
              <tr>
                <td>Has withdrawn?</td>
                <td>{txnData.ownerWithdrawn ? "Yes" : "No"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col border-start">
          <h5 className="text-center">Counterparty</h5>
          <table className="table">
            <tbody>
              <tr>
                <td>From Counterparty (mutez)</td>
                <td>{txnData.fromCounterparty}</td>
              </tr>
              <tr>
                <td>Balance (mutez)</td>
                <td>{txnData.balanceCounterparty}</td>
              </tr>
              <tr>
                <td>Has withdrawn?</td>
                <td>{txnData.counterpartyWithdrawn ? "Yes" : "No"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TxnDataTable;
