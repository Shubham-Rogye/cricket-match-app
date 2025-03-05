import { configureStore } from '@reduxjs/toolkit'
import turnReducer from "../features/UserTurn/userTurnSlice"
import bidAmountSlice from "../features/BidAmount/bidAmountSlice"
import loginPageCheckSlice from '../features/ValidityChecks/loginPageCheckSlice'
import loggedOutCheckSlice from '../features/ValidityChecks/loggedOutCheckSlice'
import loggedInCheckSlice from '../features/ValidityChecks/loggedInCheckSlice'
import newPlayerButtonSlice from '../features/ValidityChecks/newPlayerButtonSlice'
import formPageCheckSlice from '../features/ValidityChecks/formPageCheckSlice'
import auctionPageCheckSlice from '../features/ValidityChecks/auctionPageCheckSlice'
import accountLandingCheckSlice from '../features/ValidityChecks/accountLandingCheckSlice'
import auctionEndedCheckSlice from '../features/ValidityChecks/auctionEndedCheckSlice'
import urlParamSlice from '../features/UrlParam/urlParamSlice'
import soldPlayerDBSlice from '../features/GetDataBase/soldPlayersDBSlice'
import unSoldPlayerDBSlice from '../features/GetDataBase/unSoldPlayersDBSlice'
import teamOwner1Slice from '../features/TeamOwners/teamOwner1Slice'
import teamOwner2Slice from '../features/TeamOwners/teamOwner2Slice'
import teamSlice from '../features/TeamOwners/teamSlice'
export const store = configureStore({
  reducer: {
    turn: turnReducer,
    bid:bidAmountSlice,
    loginPage:loginPageCheckSlice,
    loggedOut: loggedOutCheckSlice,
    loggedIn: loggedInCheckSlice,
    newPlayer: newPlayerButtonSlice,
    formPage:formPageCheckSlice,
    auctionPage: auctionPageCheckSlice,
    accountLanding: accountLandingCheckSlice,
    urlParam: urlParamSlice,
    auctionEnded: auctionEndedCheckSlice,
    soldPlayerDB: soldPlayerDBSlice,
    unSoldPlayerDB: unSoldPlayerDBSlice,
    teamOwner1: teamOwner1Slice,
    teamOwner2: teamOwner2Slice,
    team: teamSlice
  },
})