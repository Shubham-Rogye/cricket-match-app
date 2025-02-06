import Button from 'react-bootstrap/Button';
import React, { useContext, useEffect, useRef, useState } from 'react'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Players from './Players';
import axios from 'axios';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import owner1 from '../vk18-removebg-preview.png'
import owner2 from '../rs-removebg-preview.png'
import BidPlayerBox from './BidPlayerBox';
import { ContextAuth } from '../App';
import { useNavigate } from 'react-router-dom';


const AuctionLive = () => {

    let URL = "http://localhost:5000/playersCategory"
    let soldPlayersURL = "http://localhost:6500/soldPlayers"
    const { loginPage, setLoginPage, loggedOut, setLoggedOut, bid, setBid, turn, setTurn, newPlayerBtn, setNewPlayerBtn, soldPlayers, setSoldPlayers, auctionEnded, setAuctionEnd, formPage, setFormPage,auctionPage, setAuctionPage, userParamName, setUserParamName } = useContext(ContextAuth)

    const [auctiveLive, setAuctionLive] = useState(false);
    const [players, setPlayers] = useState([]);
    const [radioValue, setRadioValue] = useState('1');
    const [playerToShow, setPlayerToShow] = useState();
    const [tabChange, setTabChange] = useState(false);
    const randomPlayer = useRef([])

    const radios = [
        { name: 'All', value: '1' },
        { name: 'Gold', value: '2' },
        { name: 'Silver', value: '3' },
        { name: 'Platnium', value: '4' },
    ];

    const navigate = useNavigate();

    const auctionCheck = () => {
        const randomStringValues = [];
        players.filter((el) => randomStringValues.push(el.id))

        const randomPlayerGen = Math.floor(Math.random() * randomStringValues.length);
        let randomStringSingleVal = randomStringValues[randomPlayerGen]

        console.log(randomStringValues)
        const randomPlayerGenenrated = players.filter((elm) => elm.id == randomStringSingleVal)
        randomPlayer.current = randomPlayerGenenrated
        if (randomPlayerGenenrated.length == 0) {
            setAuctionEnd(true)
            setAuctionLive(false)
        } else {
            setAuctionLive(true);
            setBid(parseInt(randomPlayer.current[0].bidValue))
        }
    }

    useEffect(() => {
        axios.get(URL)
            .then((res) => {
                setPlayers(res.data);
            })
        let filPlayers = []
        if (radioValue != 1) {
            filPlayers = players.filter((filPlayer) => filPlayer.category == radios[radioValue - 1].name);
            setPlayerToShow(filPlayers)
        } else {
            setPlayerToShow(players)
        }
    }, [radioValue])

    useEffect(() => {
        axios.get(soldPlayersURL)
            .then((res) => setSoldPlayers(res.data))
            .catch((err) => console.log(err))
        //     setAuctionPage(false)
        // setFormPage(false)
    })


    return (
        <>
            <Tabs
                defaultActiveKey="Live_Bidding"
                id="justify-tab-example"
                className="auction_live_tab"
                justify
            >
                <Tab eventKey="Live_Bidding" title="Live_Bidding" className='auction_tab'>
                    <div className='auction'>
                        {
                            auctiveLive ?
                                (
                                    <div className='auction_status d-flex justify-content-center align-items-center'>
                                        <div className='auction_box d-flex justify-content-space'>
                                            <div className='auction_box_owner1_section text-center' style={{ opacity: turn != 1 && "0.2" }}>
                                                <img src={owner1} />
                                                {turn == 1 && <h2 className='bg-danger text-light'>Your turn</h2>}
                                            </div>
                                            <BidPlayerBox playerName={randomPlayer.current[0].fullName} playerCat={randomPlayer.current[0].category} playerBidVal={randomPlayer.current[0].bidValue} playerSpec={randomPlayer.current[0].specification1} playerSpec1={randomPlayer.current[0].specification2} playerId={randomPlayer.current[0].id} />
                                            <div className='auction_box_owner2_section text-center' style={{ opacity: turn != 2 && "0.2" }}>
                                                <img src={owner2} />
                                                {turn == 2 && <h2 className='bg-danger text-light'>Your turn</h2>}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    auctionEnded ? (<div className='auction_status d-flex justify-content-center align-items-center'>
                                        <h2>Auction ended</h2>
                                        <Button onClick={() => navigate(`/welcome/${userParamName}`)} style={{ position: "fixed", bottom: "0" }} className='w-100 bg-danger'>
                                            Back To Dashboard
                                        </Button>
                                    </div>) : (<div className='auction_status d-flex justify-content-center align-items-center'>
                                        <Button variant="warning" onClick={auctionCheck}>Start Auction</Button>
                                    </div>)
                                )
                        }
                    </div>
                </Tab>
                <Tab eventKey="Teams" title="Teams" className='auction_tab'>
                    <div className='auction'>
                        <div className='container'>
                            teams
                        </div>
                    </div>
                </Tab>
                <Tab eventKey="Sold_players" title="Sold_players" className='auction_tab'>
                    <div className='auction'>
                        <div className='container'>
                            <div className='row'>
                                {
                                    soldPlayers.length > 0 ? soldPlayers.map((data) => (
                                        <div className='col-4 my-3' style={{ position: "relative" }} key={data.id}>
                                            <Players name={data.fullName} specification={data.specification1} category={data.category} soldPlayer={true} bidPrice={data.bidValue} />
                                        </div>
                                    )) : ""
                                }
                            </div>
                        </div>
                    </div>
                </Tab>
                <Tab eventKey="Unsold_players" title="Unsold_players" className='auction_tab'>
                    Unsold players
                </Tab>
                <Tab eventKey="YTA" title="YTA" className='auction_tab'>
                    <div className='auction'>

                        <div className='container yet_to_auction pt-5'>
                            <div className='find_player_div mb-3'>
                                <div className='find_player_div_filter'>
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
                                </div>
                            </div>
                            <div className='row'>
                                {
                                    !tabChange ? players.map((data) => (
                                        <div className='col-4 mb-3' style={{ position: "relative" }} key={data.id}>
                                            <Players name={data.fullName} specification={data.specification1} category={data.category} bidPrice={data.bidValue} soldPlayers={false} />
                                        </div>
                                    )) : playerToShow.map((data) => (
                                        <div className='col-4 mb-3' style={{ position: "relative" }} key={data.id}>
                                            <Players name={data.fullName} specification={data.specification1} category={data.category} bidPrice={data.bidValue} soldPlayers={false} />
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
