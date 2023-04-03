import React from "react";
import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import AdminPage from "./pages/AdminPage";
import { ContractDataContextProvider } from "./context/contract-data";
import { AccountDataContextProvider } from "./context/account-data";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <ContractDataContextProvider>
          <AccountDataContextProvider>
            <Routes>
              <Route path="/" element={<LandingPage></LandingPage>} />
              <Route
                path="/dashboard"
                element={<DashboardPage></DashboardPage>}
              />
              <Route path="/admin" element={<AdminPage></AdminPage>} />
            </Routes>
          </AccountDataContextProvider>
        </ContractDataContextProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
