import React from "react";

const ContractStorage = (props) => {
  console.log(props.contractStorage);
  const storage = props.contractStorage;

  return (
    <div className="container my-5">
      <h4 className="text-center">Contract storage</h4>
      <h6 className="text-center">
        <a
          href={`https://limanet.tzkt.io/${props.contractAddr}/operations/`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {props.contractAddr}
        </a>
      </h6>
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
            <td>{storage.admin}</td>
            <td>{storage.owner}</td>
            <td>{storage.counterparty}</td>
            <td>{storage.epoch}</td>
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
                <td>{storage.fromOwner}</td>
              </tr>
              <tr>
                <td>Balance (mutez)</td>
                <td>{storage.balanceOwner}</td>
              </tr>
              <tr>
                <td>Has withdrawn?</td>
                <td>{storage.ownerWithdrew ? "Yes" : "No"}</td>
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
                <td>{storage.fromCounterparty}</td>
              </tr>
              <tr>
                <td>Balance (mutez)</td>
                <td>{storage.balanceCounterparty}</td>
              </tr>
              <tr>
                <td>Has withdrawn?</td>
                <td>{storage.counterpartyWithdrew ? "Yes" : "No"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContractStorage;
