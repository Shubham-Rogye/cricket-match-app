import React, { useContext, useEffect, useRef, useState } from 'react'
import userPp from '../userPP.svg'
import Button from 'react-bootstrap/Button'
import sold from '../sold-removebg-preview.png'
import unsold from "../unSold.png"
import { ContextAuth } from '../App'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const BidPlayerBox = ({ playerName, playerCat, playerBidVal, playerSpec, playerSpec1, playerId }) => {
    const {userParamName} = useContext(ContextAuth)
    const { bid, setBid, turn, setTurn, newPlayerBtn, setNewPlayerBtn, auctionEnded, setAuctionEnd, team, setTeam } = useContext(ContextAuth)
    let soldPlayersURL = "http://localhost:6500/soldPlayers"
    let unsoldPlayersURL = "http://localhost:6500/unsoldPlayers"
    let url = 'http://localhost:5000/playersCategory'
    const navigate = useNavigate();
    const [soldActive, setSoldActive] = useState(false)
    const [timerCount, setTimerCount] = useState(30)
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
                bidValue: bid,
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
    const teamS = useRef(team)

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
            setNewPlayerBtn(true);
        }

        if(newPlayerBtn){
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    },[timerCount])

    useEffect(()=>{
        axios.get(url)
        .then((res)=> (res.data.length-2) % 2 === 0 ? setMaxPlayers(res.data.length/2 - 1):setMaxPlayers(res.data.length/2 - 1.5))
    },[])


    const bidBtnClick = () => {

        setBid(parseInt(bid) + 50)
        setUnSoldBtnDisable(true)
        if (turn == 1) {
            setTurn(turn + 1);
        } else {
            setTurn(turn - 1);
        }
        setTimerCount(30);
    }

    const soldBtnClick = (id) => {

        if(team[(turn == 1 ? 2 : 1) - 1].points < bid){
            alert("You don't have sufficient points to buy");
        }else{
            axios.get(soldPlayersURL)
            .then((res) => {
                var team1TotalPlayers = res.data.filter((elm)=>elm.owner == 1)
                var team2TotalPlayers = res.data.filter((elm)=>elm.owner == 2)

                if(turn == 2 && team1TotalPlayers.length >= maxPlayers){
                    alert(`Cannot add more than ${maxPlayers} players in one team, Please sell remaining players to team 2`)
                } else if(turn == 1 && team2TotalPlayers.length >= maxPlayers){
                    alert(`Cannot add more than ${maxPlayers} players in one team, Please sell remaining players to team 1`)
                } else{
                    setSoldActive(true)
                    setNewPlayerBtn(true)
                    teamS.current[(turn == 1 ? 2 : 1) - 1].points = teamS.current[(turn == 1 ? 2 : 1) - 1].points - bid;
                    setTeam(teamS.current)
                    randomPlayerChange.current[0].owner = turn == 1 ? 2 : 1
                    randomPlayerChange.current[0].bidValue = bid;
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
        setNewPlayerBtn(true)
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
        setNewPlayerBtn(false);
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
                            setAuctionEnd(true)
                        } else{
                            setUnSoldPlayerList(true);
                            setBid(parseInt(randomPlayerChange.current[0].bidValue))
                        }
                    })
                } else{
                    setBid(parseInt(randomPlayerChange.current[0].bidValue))
                }
            })
    }

    return (
        !auctionEnded ? randomPlayerChange.current.map((playerElm) => (
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
                        <input className='form-control' type='number' value={bid} disabled />
                        <Button variant="primary" size='sm' onClick={bidBtnClick} disabled={newPlayerBtn}>Increase Bid</Button>
                    </div>
                    <div className='mt-3 d-flex justify-content-center'>
                        <Button variant="danger" size='sm' onClick={()=>unsoldBtnClick(playerElm.id)}disabled={newPlayerBtn || unSoldBtnDisable}>Unsold</Button>
                        <Button variant="success" size='sm' className='mx-2' onClick={() => soldBtnClick(playerElm.id)} disabled={newPlayerBtn}>Sold out</Button>
                        <Button variant="info" size='sm' disabled={!newPlayerBtn} onClick={newPlayerBtnClicked}>New Player</Button>
                    </div>
                </div>
                <div className={turn == 1 ? "timer":"timer2"}>
                    <span>{timerCount}</span>
                </div>
                <img src={unSoldImage ? unsold : sold} className={soldActive ? "active" : "d-none"} width={150} />
            </div>
        )) : (<><Button onClick={() => navigate(`/welcome/${userParamName}`)} className='bg-danger'>Auction ended, Back To Dashboard
    </Button></>)
    )
}

export default BidPlayerBox
