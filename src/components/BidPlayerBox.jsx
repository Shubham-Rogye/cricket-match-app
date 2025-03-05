import React, { useContext, useEffect, useRef, useState } from 'react'
import userPp from '../userPP.svg'
import Button from 'react-bootstrap/Button'
import sold from '../sold-removebg-preview.png'
import unsold from "../unSold.png"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { player1turn, player2turn } from '../features/UserTurn/userTurnSlice'
import { incrementBid, setBidValue } from '../features/BidAmount/bidAmountSlice'
import { newPlayerFalse, newPlayerTrue } from '../features/ValidityChecks/newPlayerButtonSlice'
import { auctionEndedTrue } from '../features/ValidityChecks/auctionEndedCheckSlice'
import { team } from '../features/TeamOwners/teamSlice'


const BidPlayerBox = ({ playerName, playerCat, playerBidVal, playerSpec, playerSpec1, playerId }) => {
    let playerTurn = useSelector((state)=>state.turn.value);
    let bidAmount = useSelector((state)=>state.bid.value);
    let newPlayerButton = useSelector((state)=>state.newPlayer.value);
    const auctionEndedCheck = useSelector((state)=>state.auctionEnded.value);
    const teamDB = useSelector((state)=>state.team.value);
    const urlParamSet = useSelector((state)=>state.urlParam.value);
    const dispatch = useDispatch();
    // console.log(playerTurn)
    let soldPlayersURL = "http://localhost:6500/soldPlayers"
    let unsoldPlayersURL = "http://localhost:6500/unsoldPlayers"
    let url = 'http://localhost:5000/playersCategory'
    const navigate = useNavigate();
    const [soldActive, setSoldActive] = useState(false);
    const [timerCount, setTimerCount] = useState(30);
    const [forUnsold, setForUnsold] = useState(
        {
            id: playerId,
            bidValue: playerBidVal,
            category: playerCat,
            fullName: playerName,
            specification1: playerSpec,
            specification2: playerSpec1
        }
    )
    const randomPlayerChange = useRef(
        [
            {
                id: playerId,
                bidValue: bidAmount,
                category: playerCat,
                fullName: playerName,
                specification1: playerSpec,
                specification2: playerSpec1,
                owner: 1
            }
        ]
    )

    const [maxPlayers, setMaxPlayers] = useState(0);
    const [unSoldBtnDisable, setUnSoldBtnDisable] = useState(false);
    const [unSoldPlayerList, setUnSoldPlayerList] = useState(false);
    const [unSoldImage, setUnSoldImg] = useState(false)
    const teamS = useRef(teamDB)

    useEffect(()=>{
        const timer = timerCount > 0 && setInterval(()=> setTimerCount(timerCount - 1),1000);
        
        if (timerCount == 0) {
            axios.delete(url + "/" + playerId)
            .then((res) => console.log('record deleted'))
            .catch((err) => console.log(err))
            axios.post(unsoldPlayersURL, forUnsold)
            .then((res) => console.log('player add to unSold'))
            setUnSoldImg(true);
            setSoldActive(true);
            dispatch(newPlayerTrue());
        }

        if(newPlayerButton){
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    },[timerCount])

    useEffect(()=>{
        axios.get(url)
        .then((res)=> (res.data.length-2) % 2 === 0 ? setMaxPlayers(res.data.length/2 - 1):setMaxPlayers(res.data.length/2 - 1.5))
    },[])


    const bidBtnClick = () => {

        dispatch(incrementBid());
        setUnSoldBtnDisable(true)
        if (playerTurn == 1) {
            dispatch(player2turn());
        } else {
            dispatch(player1turn());
        }
        setTimerCount(30);
    }

    const soldBtnClick = (id) => {

        if(teamDB[(playerTurn == 1 ? 2 : 1) - 1].points < bidAmount){
            alert("You don't have sufficient points to buy");
        }else{
            axios.get(soldPlayersURL)
            .then((res) => {
                var team1TotalPlayers = res.data.filter((elm)=>elm.owner == 1)
                var team2TotalPlayers = res.data.filter((elm)=>elm.owner == 2)

                if(playerTurn == 2 && team1TotalPlayers.length >= maxPlayers){
                    alert(`Cannot add more than ${maxPlayers} players in one team, Please sell remaining players to team 2`)
                } else if(playerTurn == 1 && team2TotalPlayers.length >= maxPlayers){
                    alert(`Cannot add more than ${maxPlayers} players in one team, Please sell remaining players to team 1`)
                } else{
                    setSoldActive(true)
                    dispatch(newPlayerTrue());
                    teamS.current[(playerTurn == 1 ? 2 : 1) - 1].points = teamS.current[(playerTurn == 1 ? 2 : 1) - 1].points - bidAmount;
                    dispatch(team(teamS.current))
                    randomPlayerChange.current[0].owner = playerTurn == 1 ? 2 : 1
                    randomPlayerChange.current[0].bidValue = bidAmount;
                    axios.delete(unSoldPlayerList ? unsoldPlayersURL + "/" + id : url + "/" + id)
                        .then((res) => console.log('record deleted'))
                        .catch((err) => console.log(err))

                    axios.post(soldPlayersURL, randomPlayerChange.current[0])
                        .then((res) => console.log('playerSold'))
                }
            });

            
        }

    }

    const unsoldBtnClick = (id) => {
        setUnSoldImg(true)
        setSoldActive(true)
        dispatch(newPlayerTrue());
        axios.delete(url + "/" + id)
            .then((res) => console.log('record deleted'))
            .catch((err) => console.log(err))
        axios.post(unsoldPlayersURL, forUnsold)
            .then((res) => console.log('player add to unSold'))

    }

    const newPlayerBtnClicked = () => {
        setUnSoldImg(false)
        setUnSoldBtnDisable(false)
        setTimerCount(30);
        setSoldActive(false)
        dispatch(newPlayerFalse());
        axios.get(url)
            .then((res) => {
                const randomStringValues = [];
                res.data.filter((el) => el.captain == false && randomStringValues.push(el.id))


                let randomNum = Math.floor(Math.random() * randomStringValues.length)
                randomNum = randomStringValues[randomNum]
                randomPlayerChange.current = res.data.filter((fl) => fl.id == randomNum)
                if (randomPlayerChange.current.length == 0) {
                    
                    axios.get(unsoldPlayersURL)
                    .then((res)=>{
                        const randomStringValues = [];
                        res.data.filter((el) => randomStringValues.push(el.id))
                        let randomNum = Math.floor(Math.random() * randomStringValues.length)
                        randomNum = randomStringValues[randomNum]
                        randomPlayerChange.current = res.data.filter((fl) => fl.id == randomNum)

                        if(randomPlayerChange.current.length == 0){
                            dispatch(auctionEndedTrue());
                        } else{
                            setUnSoldPlayerList(true);
                            dispatch(setBidValue(parseInt(randomPlayerChange.current[0].bidValue)));
                        }
                    })
                } else{
                    dispatch(setBidValue(parseInt(randomPlayerChange.current[0].bidValue)));
                }
            })
    }

    return (
        !auctionEndedCheck ? randomPlayerChange.current.map((playerElm) => (
            <div className='auction_box_player_section' key={playerElm.id}>
                <div className='auction_box_player_section_details bg-light border p-3 rounded shadow'>
                    <h2 className='text-center bg-dark text-light p-2 rounded'>{playerElm.fullName}</h2>
                    <div className='auction_box_player_section_details_img text-center mb-2'>
                        <img src={userPp} alt='Player Image' width={200} />
                    </div>
                    <div className='auction_box_player_section_details_typ'>
                        <div className='row'>
                            <div className='col-6'>
                                <label><strong>Category:</strong> {playerElm.category}</label>
                            </div>
                            <div className='col-6'><label><strong>Bid price</strong> {playerElm.bidValue}</label></div>
                            <div className='col-12 mt-2'>
                                <label><strong>Specification:</strong> {playerElm.specification1}</label>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className='auction_box_player_section_bid_input_box d-flex justify-content-between'>
                        <input className='form-control' type='number' value={bidAmount} disabled />
                        <Button variant="primary" size='sm' onClick={bidBtnClick} disabled={newPlayerButton}>Increase Bid</Button>
                    </div>
                    <div className='mt-3 d-flex justify-content-center'>
                        <Button variant="danger" size='sm' onClick={()=>unsoldBtnClick(playerElm.id)}disabled={newPlayerButton || unSoldBtnDisable}>Unsold</Button>
                        <Button variant="success" size='sm' className='mx-2' onClick={() => soldBtnClick(playerElm.id)} disabled={newPlayerButton}>Sold out</Button>
                        <Button variant="info" size='sm' disabled={!newPlayerButton} onClick={newPlayerBtnClicked}>New Player</Button>
                    </div>
                </div>
                <div className={playerTurn == 1 ? "timer":"timer2"}>
                    <span>{timerCount}</span>
                </div>
                <img src={unSoldImage ? unsold : sold} className={soldActive ? "active" : "d-none"} width={150} />
            </div>
        )) : (<><Button onClick={() => navigate(`/welcome/${urlParamSet}`)} className='bg-danger'>Auction ended, Back To Dashboard
    </Button></>)
    )
}

export default BidPlayerBox
