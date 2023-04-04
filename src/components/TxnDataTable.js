import React from "react";

import { network, contractAddr } from "../utils/wallet";

const TxnDataTable = (props) => {
  const txnData = props.txnData;

  console.log(txnData);

  return (
    <div className="container mb-5">
      {Object.keys(txnData).length > 0 ? (
        <>
          <h4 className="text-center">Escrow Transaction Data</h4>
          {txnData.escrowWithdrawn && (
            <h5 className="text-danger text-center mb-3">
              This escrow transaction was withdrawn by both parties.
            </h5>
          )}
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
                <td>{new Date(txnData.epoch).toString()}</td>
              </tr>
            </tbody>
          </table>
          <div className="row">
            <div className="col border-end">
              <h5 className="text-center">Owner</h5>
              <table className="table">
                <tbody>
                  <tr>
                    <td>From Owner (tez)</td>
                    <td>
                      {(parseInt(txnData.fromOwner) / 10 ** 6).toString()}
                    </td>
                  </tr>
                  <tr>
                    <td>Balance (tez)</td>
                    <td>
                      {(parseInt(txnData.balanceOwner) / 10 ** 6).toString()}
                    </td>
                  </tr>
                  <tr>
                    <td>Has desposited?</td>
                    <td>
                      {txnData.fromOwner === txnData.balanceOwner
                        ? "Yes"
                        : "No"}
                    </td>
                  </tr>
                  <tr>
                    <td>Has withdrawn?</td>
                    <td>{txnData.ownerWithdrawn ? "Yes" : "No"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col">
              <h5 className="text-center">Counterparty</h5>
              <table className="table">
                <tbody>
                  <tr>
                    <td>From Counterparty (tez)</td>
                    <td>
                      {(
                        parseInt(txnData.fromCounterparty) /
                        10 ** 6
                      ).toString()}
                    </td>
                  </tr>
                  <tr>
                    <td>Balance (tez)</td>
                    <td>
                      {(
                        parseInt(txnData.balanceCounterparty) /
                        10 ** 6
                      ).toString()}
                    </td>
                  </tr>
                  <tr>
                    <td>Has desposited?</td>
                    <td>
                      {txnData.fromCounterparty === txnData.balanceCounterparty
                        ? "Yes"
                        : "No"}
                    </td>
                  </tr>
                  <tr>
                    <td>Has withdrawn?</td>
                    <td>{txnData.counterpartyWithdrawn ? "Yes" : "No"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <h4 className="text-center">
          Account is not involved in any escrow transaction.
        </h4>
      )}
    </div>
  );
};

export default TxnDataTable;
