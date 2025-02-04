import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import { createContext, useState } from 'react';
import AccountLanding from './components/AccountLanding';
import AuctionLive from './components/AuctionLive';
import FormPagePlayer from './components/FormPagePlayer';

export const ContextAuth = createContext();

function App() {
  const [loginPage, setLoginPage] = useState(false)
  const [loggedOut, setLoggedOut] = useState(false)
  const [bid, setBid] = useState(200)
  const [turn, setTurn] = useState(1)
  const [newPlayerBtn, setNewPlayerBtn] = useState(false)
  const [soldPlayers, setSoldPlayers] = useState([]);
  const [auctionEnded, setAuctionEnd] = useState(false)
  return (
    <>
      <ContextAuth.Provider value={{loginPage, setLoginPage,loggedOut, setLoggedOut,bid, setBid, turn, setTurn, newPlayerBtn, setNewPlayerBtn,soldPlayers, setSoldPlayers, auctionEnded, setAuctionEnd }}>
        <BrowserRouter>
          <Routes>
            <Route path='/' index element={<LandingPage />} />
            <Route path='/login' element={<Login />} />
            <Route path='/liveAuction' element={<AuctionLive />} />
            <Route path='/welcome/:name' element={<AccountLanding />} />
            <Route path='/formPage' element={<FormPagePlayer/>}/>
          </Routes>
        </BrowserRouter>
      </ContextAuth.Provider>
    </>
  );
}

export default App;
