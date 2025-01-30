import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import { createContext, useState } from 'react';
import AccountLanding from './components/AccountLanding';

export const ContextAuth = createContext();

function App() {
  const [loginPage, setLoginPage] = useState(false)
  const [loggedOut, setLoggedOut] = useState(false)
  return (
    <>
      <ContextAuth.Provider value={{loginPage, setLoginPage,loggedOut, setLoggedOut}}>
        <BrowserRouter>
          <Routes>
            <Route path='/' index element={<LandingPage />} />
            <Route path='/login' element={<Login />} />
            <Route path='/welcome/:name' element={<AccountLanding />} />
          </Routes>
        </BrowserRouter>
      </ContextAuth.Provider>
    </>
  );
}

export default App;
