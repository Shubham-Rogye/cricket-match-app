import React, { useContext } from 'react'
import NavbarComp from '../components/Navbar'
import Banner from '../components/Banner'
import LastMatchResult from '../components/LastMatchResult'
import MatchTiming from './MatchTiming'
import { useDispatch, useSelector } from 'react-redux'
import { loginPageFalse } from '../features/ValidityChecks/loginPageCheckSlice'
const LandingPage = () => {
  const loginPageCheck = useSelector((state)=>state.loginPage.value);
  const dispatch = useDispatch();
  dispatch(loginPageFalse);
  return (
    <>
        <NavbarComp valid={loginPageCheck}/>
        <Banner/>
        <LastMatchResult/>
        <MatchTiming/>
    </>
  )
}

export default LandingPage
