import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import AccountLanding from "./components/AccountLanding";
import AuctionLive from "./components/AuctionLive";
import FormPagePlayer from "./components/FormPagePlayer";
import UnauthorizedAccess from "./components/UnauthorizedAccess";
import PageNotFound from "./components/PageNotFound";
import { store } from '../src/redux/store.js'
import { Provider } from 'react-redux'

function App() {
  return (
    <>
      <Provider store={store}>
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
      </Provider>
    </>
  );
}

export default App;
