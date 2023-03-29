import React from "react";

const Navbar = (props) => {
  return (
    <nav className="navbar sticky-top border mb-4 bg-light">
      <div className="container py-2">
        <div className="navbar-brand">CS 173 Mini-Project 2</div>
        <div className="d-flex">
          <button onClick={props.onConnectWallet} className="btn btn-primary">
            {props.accountAddr ? props.accountAddr : "Connect Wallet"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
