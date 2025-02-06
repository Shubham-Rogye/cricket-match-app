import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import { createContext, useState } from "react";
import AccountLanding from "./components/AccountLanding";
import AuctionLive from "./components/AuctionLive";
import FormPagePlayer from "./components/FormPagePlayer";
import UnauthorizedAccess from "./components/UnauthorizedAccess";
import PageNotFound from "./components/PageNotFound";

export const ContextAuth = createContext();

function App() {
  const [loginPage, setLoginPage] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [bid, setBid] = useState(200);
  const [turn, setTurn] = useState(1);
  const [newPlayerBtn, setNewPlayerBtn] = useState(false);
  const [soldPlayers, setSoldPlayers] = useState([]);
  const [auctionEnded, setAuctionEnd] = useState(false);
  const [formPage, setFormPage] = useState(false);
  const [auctionPage, setAuctionPage] = useState(false);
  const [accLanding, setAccLanding] = useState(false);
  const [userParamName, setUserParamName] = useState("")
  return (
    <>
      <ContextAuth.Provider
        value={{
          loginPage,
          setLoginPage,
          loggedOut,
          setLoggedOut,
          bid,
          setBid,
          turn,
          setTurn,
          newPlayerBtn,
          setNewPlayerBtn,
          soldPlayers,
          setSoldPlayers,
          auctionEnded,
          setAuctionEnd,
          loggedIn,
          setLoggedIn,
          formPage, setFormPage,auctionPage, setAuctionPage,accLanding, setAccLanding, userParamName, setUserParamName
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" index element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/welcome/:name/" element={<AccountLanding />}>
              <Route path=":name/liveAuction" element={<AuctionLive />} />
              <Route path=":name/formPage" element={<FormPagePlayer />} />
            </Route>
            <Route path="/unauthorizedPage" element={<UnauthorizedAccess />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </ContextAuth.Provider>
    </>
  );
}

export default App;
