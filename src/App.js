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
import owner1 from './team1.png'
import owner2 from './team3.png'

export const ContextAuth = createContext();

function App() {
  const [loginPage, setLoginPage] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [bid, setBid] = useState(200);
  const [turn, setTurn] = useState(1);
  const [newPlayerBtn, setNewPlayerBtn] = useState(false);
  const [soldPlayers, setSoldPlayers] = useState([]);
  const [auctionEnded, setAuctionEnd] = useState(null);
  const [formPage, setFormPage] = useState(false);
  const [auctionPage, setAuctionPage] = useState(false);
  const [accLanding, setAccLanding] = useState(false);
  const [userParamName, setUserParamName] = useState("");
  const [unsoldPlayers,setUnSoldPlayers] = useState([]);
  const [owner1Team, setOwner1Team] = useState([]);
  const [owner2Team, setOwner2Team] = useState([]);
  const [team, setTeam] = useState([
    {
      "logo": owner1,
      "name":"Chacha Phaltan",
      "owner":"Sanket Chawan",
      "points":6000
    },
    {
      "logo": owner2,
      "name":"Pratz warriors",
      "owner":"Prathmesh Desai",
      "points":6000
    }
  ])
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
          formPage, 
          setFormPage, 
          auctionPage, 
          setAuctionPage, 
          accLanding, 
          setAccLanding, 
          userParamName, 
          setUserParamName,
          unsoldPlayers,
          setUnSoldPlayers,
          owner1Team,
          setOwner1Team,
          owner2Team,
          setOwner2Team,
          team,
          setTeam
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" index element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/welcome/" element={<AccountLanding />}>
              <Route path=":name" element={<AccountLanding />} >
                <Route path="liveAuction" element={<AuctionLive />} />
                <Route path="formPage" element={<FormPagePlayer />} />
              </Route>
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
