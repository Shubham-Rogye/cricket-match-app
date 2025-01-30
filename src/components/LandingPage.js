import React, { useContext } from 'react'
import NavbarComp from '../components/Navbar'
import Banner from '../components/Banner'
import LastMatchResult from '../components/LastMatchResult'
import MatchTiming from './MatchTiming'
import { ContextAuth } from '../App'
const LandingPage = () => {
  const {loginPage, setLoginPage,loggedOut, setLoggedOut} = useContext(ContextAuth)
  setLoginPage(false)
  return (
    <>
        <NavbarComp valid={loginPage}/>
        <Banner/>
        <LastMatchResult/>
        <MatchTiming/>
    </>
  )
}

export default LandingPage
