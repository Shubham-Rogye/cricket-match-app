import Button from 'react-bootstrap/Button';
import React, { useContext, useEffect, useRef, useState } from 'react'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Players from './Players';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import owner1 from '../vk18-removebg-preview.png'
import owner2 from '../rs-removebg-preview.png'
import BidPlayerBox from './BidPlayerBox';
import { useNavigate, useParams } from 'react-router-dom';
import { useReactToPrint } from "react-to-print";


import teamowner1 from '../team1.png'
import teamowner2 from '../team3.png'
import { useDispatch, useSelector } from 'react-redux';
import { setBidValue } from '../features/BidAmount/bidAmountSlice';
import { auctionEndedTrue } from '../features/ValidityChecks/auctionEndedCheckSlice';
import { soldPlayerDB } from '../features/GetDataBase/soldPlayersDBSlice';
import { unSoldPlayerDB } from '../features/GetDataBase/unSoldPlayersDBSlice';
import { teamOwner1 } from '../features/TeamOwners/teamOwner1Slice';
import { teamOwner2 } from '../features/TeamOwners/teamOwner2Slice';
import { collection, doc, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { setLoader } from '../features/Loader/loaderSlice';
import { useAuth } from '../contexts/authContext';
import { team } from '../features/TeamOwners/teamSlice';


const AuctionLive = () => {
    const playerTurn = useSelector((state)=>state.turn.value);
    const auctionEndedCheck = useSelector((state)=>state.auctionEnded.value);
    const soldPlayerDBdata = useSelector((state)=>state.soldPlayerDB.value);
    const unSoldPlayerDBdata = useSelector((state)=>state.unSoldPlayerDB.value);
    const teamOwner1data = useSelector((state)=>state.teamOwner1.value);
    const teamOwner2data = useSelector((state)=>state.teamOwner2.value);
    const urlParamSet = useSelector((state)=>state.urlParam.value);
    const teamD = useSelector((state)=>state.team.value)
    const dispatch = useDispatch();
    const param = useParams();
    const { currentUser } = useAuth();

    const [auctiveLive, setAuctionLive] = useState(false);
    const [players, setPlayers] = useState([]);
    const [radioValue, setRadioValue] = useState('1');
    const [playerToShow, setPlayerToShow] = useState();
    const [tabChange, setTabChange] = useState(false);
    const [newTab, setNewTab] = useState(false);
    const randomPlayer = useRef([]);
    const contentRef = useRef(null);
    const [aucD, setAucD] = useState(JSON.parse(localStorage.getItem('auctionData')));
    const reactToPrintFn = useReactToPrint({ contentRef });
    const getAuctionrDoc = doc(db, "users", currentUser.uid, "auctions", aucD[0].id);
    

    const radios = [
        { name: 'All', value: '1' },
        { name: 'Gold', value: '2' },
        { name: 'Silver', value: '3' },
        { name: 'Platnium', value: '4' },
    ];

    const navigate = useNavigate();

    const auctionCheck = () => {
        const randomStringValues = [];
        players.filter((el) => el.captain == false && randomStringValues.push(el.id))

        const randomPlayerGen = Math.floor(Math.random() * randomStringValues.length);
        let randomStringSingleVal = randomStringValues[randomPlayerGen]
        const randomPlayerGenenrated = players.filter((elm) => elm.id == randomStringSingleVal)
        randomPlayer.current = randomPlayerGenenrated
        if (randomPlayerGenenrated.length == 0) {
            dispatch(auctionEndedTrue());
            setAuctionLive(false)
        } else {
            setAuctionLive(true);
            dispatch(setBidValue(randomPlayer.current[0].bidValue));
        }
    }

    useEffect(() => {
        dispatch(setLoader(true));
        const getAuctionrDoc = doc(db, "users", currentUser.uid, "auctions", aucD[0].id);
        const playerCollectionInsideAuctionDoc = collection(getAuctionrDoc, "players");

        getDocs(playerCollectionInsideAuctionDoc).then((res) => {
            dispatch(setLoader(false));
            let playerData = [];
            if (res._snapshot.docChanges.length > 0) {
                res.forEach((doc) => {
                    let data = doc.data()
                    data = { ...data, id: doc.id };
                    playerData.push(data)
                });
            }
            if(playerData.length > 0){
                setPlayers(playerData);
            } else{
                setPlayers([])
            }
        }).catch(() => dispatch(setLoader(false)));
        
        let filPlayers = []
        if (radioValue != 1) {
            filPlayers = players.filter((filPlayer) => filPlayer.category == radios[radioValue - 1].name);
            setPlayerToShow(filPlayers)
        } else {
            setPlayerToShow(players)
        }
    }, [radioValue, soldPlayerDBdata])

    useEffect(() => {
        dispatch(setLoader(true));
        const getsoldPlayerCollectionInsideAuctionDoc = collection(getAuctionrDoc, "soldPlayers");
        const getUnsoldPlayerCollectionInsideAuctionDoc = collection(getAuctionrDoc, "unsoldPlayers");

        getDocs(getsoldPlayerCollectionInsideAuctionDoc)
        .then((res) => {
            dispatch(setLoader(false));
            let playerData = [];
            if (res._snapshot.docChanges.length > 0) {
                res.forEach((doc) => {
                    let data = doc.data()
                    data = { ...data, id: doc.id };
                    playerData.push(data)
                });
                dispatch(soldPlayerDB(playerData))
                dispatch(teamOwner1(playerData.filter((owner) => owner.owner == 1)));
                dispatch(teamOwner2(playerData.filter((owner) => owner.owner == 2))); 
            }else{
                dispatch(soldPlayerDB([]))
                dispatch(teamOwner1([]));
                dispatch(teamOwner2([])); 
            }
        })
        .catch(() => dispatch(setLoader(false)))

        getDocs(getUnsoldPlayerCollectionInsideAuctionDoc)
        .then((res) => {
            dispatch(setLoader(false));
            let playerData = [];
            if (res._snapshot.docChanges.length > 0) {
                res.forEach((doc) => {
                    let data = doc.data()
                    data = { ...data, id: doc.id };
                    playerData.push(data)
                });
                dispatch(unSoldPlayerDB(playerData));
            } else{
                dispatch(unSoldPlayerDB([]))
            }
        })
        .catch(() => dispatch(setLoader(false)))
        return
    },[newTab])

    useEffect(() => {
        dispatch(setLoader(true));
        const teamCollectionInsideAuctionDoc = collection(getAuctionrDoc, "teams");
        const playerCollectionInsideAuctionDoc = collection(getAuctionrDoc, "players");

        getDocs(teamCollectionInsideAuctionDoc).then((res) => {
            dispatch(setLoader(false));
            let teamData;
            if (res._snapshot.docChanges.length > 0) {
                res.forEach((doc) => {
                    teamData = doc.data()
                });
            }
            dispatch(team(teamData.teams));
        }).catch(() => dispatch(setLoader(false)))

        getDocs(playerCollectionInsideAuctionDoc).then((res) => {
            dispatch(setLoader(false));
            let playerData = [];
            if (res._snapshot.docChanges.length > 0) {
                res.forEach((doc) => {
                    let data = doc.data()
                    data = { ...data, id: doc.id };
                    playerData.push(data)
                });
            }
            if(playerData.length > 0){
                setPlayers(playerData);
            } else{
                setPlayers([])
            }
        }).catch(() => dispatch(setLoader(false)))
    }, [])

    return (
        <>
            <Tabs
                defaultActiveKey="Live_Bidding"
                id="justify-tab-example"
                className="auction_live_tab"
                justify
                onSelect={()=>setNewTab(!newTab)}
            >
                <Tab eventKey="Live_Bidding" title="Live_Bidding" className='auction_tab'>
                    <div className='auction'>
                        {
                            auctiveLive ?
                                (
                                    teamD.length>0 ? (
                                        <div className='auction_status d-flex justify-content-center align-items-center'>
                                        <div className='auction_box d-flex justify-content-space align-items-center'>
                                            {!auctionEndedCheck ? <div className='auction_box_owner1_section text-center' style={{ opacity: playerTurn != 1 && "0.2" }}>
                                                <img className="d-none d-lg-block" src={owner1} style={{height:"455px"}}/>
                                                {playerTurn == 1 && 
                                                        <>
                                                            <h2 className='bg-dark text-light'>{teamD[0].name}'s turn</h2>
                                                            <div className='points_left d-flex align-items-center justify-content-evenly'>
                                                                <div className='text-light bg-danger p-2 w-50'>Points Left</div>
                                                                <div className='text-dark bg-light p-2 w-50'>{teamD[0].points}</div>                                                               
                                                            </div>
                                                        </>
                                                }
                                                
                                            </div> : null}
                                            <BidPlayerBox playerName={randomPlayer.current[0].fullName} playerCat={randomPlayer.current[0].category} playerBidVal={randomPlayer.current[0].bidValue} playerSpec={randomPlayer.current[0].specification1} playerSpec1={randomPlayer.current[0].specification2} playerId={randomPlayer.current[0].id} />
                                            {
                                                !auctionEndedCheck ? <div className='auction_box_owner2_section text-center' style={{ opacity: playerTurn != 2 && "0.2" }}>
                                                <img className='d-none d-lg-block' src={owner2} style={{height:"455px"}}/>
                                                        {playerTurn == 2 &&
                                                            <>
                                                                <h2 className='bg-dark text-light'>{teamD[1].name}'s turn</h2>
                                                                <div className='points_left d-flex align-items-center justify-content-evenly'>
                                                                    <div className='text-light bg-danger p-2 w-50'>Points Left</div>
                                                                    <div className='text-dark bg-light p-2 w-50'>{teamD[1].points}</div>
                                                                </div>
                                                            </>
                                                        }
                                                
                                            </div>: null
                                            }
                                        </div>
                                    </div>
                                    ):(
                                        <h2>Please create the team first</h2>
                                    )
                                ) : (
                                    auctionEndedCheck ? (<div className='auction_status d-flex justify-content-center align-items-center'>
                                        <h2>Please Register players for the auction</h2>
                                        <Button onClick={() => navigate(`/welcome/${urlParamSet}`)} style={{ position: "fixed", bottom: "0" }} className='w-100 bg-danger'>
                                            Back To Dashboard
                                        </Button>
                                    </div>) : (<div className='auction_status d-flex justify-content-center align-items-center'>
                                        <Button variant="dark" onClick={auctionCheck}>Start Auction</Button>
                                    </div>)
                                )
                        }
                    </div>
                </Tab>
                <Tab eventKey="Teams" title="Teams" className='auction_tab'>
                    <div className='auction pt-5'>
                        <div className='container'>
                            <div className='row  justify-content-between' style={{gap:"6px"}} ref={contentRef}>
                                {
                                    teamD.map((elm, index)=>(
                                        <div className='col bg-light' style={{ height: "fit-content" }}>
                                            <div className='Team1_col text-center' key={elm.id}>
                                                <div className={index == 0 ? 'Team1_col_heading mt-2 py-3 bg-info text-light':'Team1_col_heading mt-2 py-3 bg-primary text-light'}>
                                                    <h2>{elm.name}</h2>
                                                </div>
                                                <hr />
                                                <div className='Team1_col_players_list'>
                                                    {
                                                       index == 0 ? (teamOwner1data.length > 0 ? teamOwner1data.map((data) => (
                                                        <div className='d-flex justify-content-between' key={data.id}>
                                                            <div className='team_img'>
                                                                <img src={owner1} />
                                                            </div>
                                                            <div className='player_detail'>
                                                                <p className='m-0 fw-bold' >{data.fullName}</p>
                                                                <small>{data.specification1}</small>
                                                            </div>
                                                            <div className='player_img'>
                                                                <img src={teamowner1} width={50} />
                                                            </div>
                                                        </div>
                                                    )) : ""):(teamOwner2data.length > 0 ? teamOwner2data.map((data) => (
                                                        <div className='d-flex justify-content-between' key={data.id}>
                                                            <div className='team_img'>
                                                                <img src={owner2} />
                                                            </div>
                                                            <div className='player_detail'>
                                                                <p className='m-0 fw-bold' >{data.fullName}</p>
                                                                <small>{data.specification1}</small>
                                                            </div>
                                                            <div className='player_img'>
                                                                <img src={teamowner2} width={50} />
                                                            </div>
                                                        </div>
                                                    )) : "")
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className='d-flex justify-content-center mt-3'>
                                <Button variant='danger' onClick={() => reactToPrintFn()}>Take Print</Button>                                
                            </div>
                        </div>
                    </div>
                </Tab>
                <Tab eventKey="Sold_players" title="Sold_players" className='auction_tab'>
                    <div className='auction'>
                        <div className='container'>
                            <div className='row'>
                                {
                                    soldPlayerDBdata.length > 0 ? soldPlayerDBdata.map((data) => (
                                        <div className='col-12 col-sm-12 col-md-6 col-lg-4 my-3' style={{ position: "relative" }} key={data.id}>
                                            <Players name={data.fullName} specification={data.specification1} category={data.category} soldPlayer={true} bidPrice={data.bidValue} owner={data.owner} />
                                        </div>
                                    )) : ""
                                }
                            </div>
                        </div>
                    </div>
                </Tab>
                <Tab eventKey="Unsold_players" title="Unsold_players" className='auction_tab'>
                <div className='auction'>
                        <div className='container'>
                            <div className='row'>
                                {
                                    unSoldPlayerDBdata.length > 0 ? unSoldPlayerDBdata.map((data) => (
                                        <div className='col-12 col-sm-12 col-md-6 col-lg-4 my-3' style={{ position: "relative" }} key={data.id}>
                                            <Players name={data.fullName} specification={data.specification1} category={data.category} bidPrice={data.bidValue} />
                                        </div>
                                    )) : ""
                                }
                            </div>
                        </div>
                    </div>
                </Tab>
                <Tab eventKey="YTA" title="YTA" className='auction_tab'>
                    <div className='auction'>

                        <div className='container yet_to_auction pt-5'>
                            <div className='find_player_div mb-3'>
                                <div className='find_player_div_filter'>
                                    {
                                        players.length > 0 ? (
                                            <>
                                                <strong className='text-light'>Filter: </strong>
                                                <ButtonGroup>
                                                    {radios.map((radio, idx) => (
                                                        <ToggleButton
                                                            key={idx}
                                                            id={`radio-${idx}`}
                                                            type="radio"
                                                            variant={'outline-warning'}
                                                            name="radio"
                                                            value={radio.value}
                                                            checked={radioValue === radio.value}
                                                            onChange={() => { setRadioValue(radio.value); setTabChange(true) }}
                                                        >
                                                            {radio.name}
                                                        </ToggleButton>
                                                    ))}
                                                </ButtonGroup>
                                            </>
                                        ) : (
                                            <>
                                                <h2 className='text-light'>Please fill players registeration form to add players for auction</h2>
                                                <Button onClick={() => navigate(`/welcome/${param.name}/formPage`)}>Click Here to register players</Button>
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                            <div className='row'>
                                {
                                    !tabChange ? players.map((data) => (
                                        <div className='col-12 col-xs-12 col-sm-12 col-md-6 col-lg-4 mb-3' style={{ position: "relative" }} key={data.id}>
                                            <Players name={data.fullName} specification={data.specification1} category={data.category} bidPrice={data.bidValue} soldPlayers={false} captain={data.captain}/>
                                        </div>
                                    )) : playerToShow.map((data) => (
                                        <div className='col-12 col-xs-12 col-sm-12 col-md-6 col-lg-4 mb-3' style={{ position: "relative" }} key={data.id}>
                                            <Players name={data.fullName} specification={data.specification1} category={data.category} bidPrice={data.bidValue} soldPlayers={false} captain={data.captain}/>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </Tab>
            </Tabs>
        </>
    )
}

export default AuctionLive
