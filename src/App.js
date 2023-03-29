import React, { useState, useEffect } from "react";
import ContractStorage from "./components/ContractStorage";

import Navbar from "./components/Navbar";
import { connectWallet, getAccountAddr } from "./utils/wallet";
import { fetchContractStorage } from "./utils/tzkt";

const App = () => {
  const [accountAddr, setAccountAddr] = useState("");
  const [contractStorage, setContractStorage] = useState({});
  const [partyInfo, setPartyInfo] = useState({});

  useEffect(() => {
    (async () => {
      const accountAddr = await getAccountAddr();
      setAccountAddr(accountAddr);
    })();
  }, []);

  const onConnectWallet = async () => {
    await connectWallet();
    const account = await getAccountAddr();
    setAccountAddr(account);
  };

  const contractAddr = "KT1EUWtC9Uh6MMr2oYaG9hKnrF6eaAXKTzpJ";
  useEffect(() => {
    (async () => {
      const contractStorage = await fetchContractStorage(contractAddr);
      setContractStorage(contractStorage);
      const partyInfo = {};
      console.log(accountAddr);
      console.log(contractStorage.owner);
      if (accountAddr == contractStorage.owner) {
        partyInfo.type = "owner";
      } else if (accountAddr === contractStorage.owner) {
        partyInfo.type = "counterparty";
      } else if (accountAddr === contractStorage.admin) {
        partyInfo.type = "admin";
      } else {
        partyInfo.type = "not participant";
      }

      if (partyInfo.type === "owner") {
        partyInfo = {
          ...partyInfo,
          toDeposit: contractStorage.fromOwner,
          balance: contractStorage.balanceOwner,
          withdrew: contractStorage.ownerWithdrew,
        };
      } else if (partyInfo.type === "counterparty") {
        partyInfo = {
          ...partyInfo,
          toDeposit: contractStorage.fromCounterparty,
          balance: contractStorage.balanceCounterparty,
          withdrew: contractStorage.counterpartyWithdrew,
        };
      }
      setPartyInfo(partyInfo);
      console.log(partyInfo);
    })();
  }, []);

  return (
    <>
      <Navbar
        accountAddr={accountAddr}
        onConnectWallet={onConnectWallet}
      ></Navbar>
      <h1 className="text-center">An Escrow Contract Project</h1>
      <h4 className="text-center mb-4">by Anthony Van Cayetano</h4>
      <ContractStorage
        contractStorage={contractStorage}
        contractAddr={contractAddr}
      ></ContractStorage>
      {accountAddr === contractStorage.admin && (
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
      )}
    </>
  );
};

export default App;
