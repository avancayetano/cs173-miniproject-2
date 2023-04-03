import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import AccountDataContext from "../context/account-data";
import { getAccountAddressLink } from "../utils/links";

const Navbar = (props) => {
  const navigate = useNavigate();

  const accountDataContext = useContext(AccountDataContext);

  const onDisconnectWallet = () => {
    accountDataContext.resetAccountData();
    navigate("/");
  };

  return (
    <nav className="navbar sticky-top border mb-4 bg-light">
      <div className="container py-2">
        <div className="navbar-brand">CS 173 Mini-Project 2</div>
        {accountDataContext.address !== "" && (
          <div className="d-flex dropdown">
            <button
              className="btn btn-primary dropdown-toggle"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Account
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={getAccountAddressLink(accountDataContext.address)}
                  className="dropdown-item btn text-truncate"
                  style={{ maxWidth: "200px" }}
                >
                  {accountDataContext.address}
                </a>
              </li>
              <li>
                <div onClick={onDisconnectWallet} className="dropdown-item btn">
                  Log Out
                </div>
              </li>
              <li></li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
