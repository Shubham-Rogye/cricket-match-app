import React, { useContext, useEffect, useRef, useState } from 'react'
import userPp from '../userPP.svg'
import Button from 'react-bootstrap/Button'
import sold from '../sold-removebg-preview.png'
import { ContextAuth } from '../App'
import axios from 'axios'

const BidPlayerBox = ({ playerName, playerCat, playerBidVal, playerSpec, playerSpec1, playerId }) => {
    let soldPlayersURL = "http://localhost:6500/soldPlayers"
    let url = 'http://localhost:5000/playersCategory'
    const { loginPage, setLoginPage, loggedOut, setLoggedOut, bid, setBid, turn, setTurn, newPlayerBtn, setNewPlayerBtn,auctionEnded, setAuctionEnd } = useContext(ContextAuth)
    const randomPlayerChange = useRef(
        [
            {   id:playerId,
                baseValue: bid,
                category: playerCat,
                playerName: playerName,
                specification1: playerSpec,
                specification2: playerSpec1
            }
        ]
    )
    const [soldActive, setSoldActive] = useState(false)


    const bidBtnClick = () => {
        setBid(parseInt(bid) + 50)
        if (turn == 1) {
            setTurn(turn + 1);
        } else {
            setTurn(turn - 1);
        }
    }

    const soldBtnClick = (id) => {
        setSoldActive(true)
        setNewPlayerBtn(true)
        randomPlayerChange.current[0].baseValue = bid;

        axios.delete(url+"/"+id)
        .then((res)=>console.log('record deleted'))
        .catch((err)=>console.log(err))

        axios.post(soldPlayersURL, randomPlayerChange.current[0])
            .then((res) => console.log('playerSold'))

    }

    const newPlayerBtnClicked = () => {
        setSoldActive(false)
        setNewPlayerBtn(false);
        axios.get(url)
            .then((res) => {
                let randomNum = Math.floor(Math.random() * (res.data.length - 1 + 1) + 1)
                randomPlayerChange.current = res.data.filter((fl) => fl.id == randomNum)
                if(randomPlayerChange.current.length == 0){
                    setAuctionEnd(true)
                } else{
                    setBid(parseInt(randomPlayerChange.current[0].baseValue))
                }
            })
    }

    return (
        !auctionEnded ? randomPlayerChange.current.map((playerElm) => (
            <div className='auction_box_player_section' key={playerElm.id}>
                <div className='auction_box_player_section_details bg-light border p-3 rounded shadow'>
                    <h2 className='text-center bg-dark text-light p-2 rounded'>{playerElm.playerName}</h2>
                    <div className='auction_box_player_section_details_img text-center mb-2'>
                        <img src={userPp} alt='Player Image' width={200} />
                    </div>
                    <div className='auction_box_player_section_details_typ'>
                        <div className='row'>
                            <div className='col-6'>
                                <label><strong>Category:</strong> {playerElm.category}</label>
                            </div>
                            <div className='col-6'><label><strong>Bid price</strong> {playerElm.baseValue}</label></div>
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
                        <Button variant="danger" size='sm' disabled={newPlayerBtn}>Unsold</Button>
                        <Button variant="success" size='sm' className='mx-2' onClick={() => soldBtnClick(playerElm.id)} disabled={newPlayerBtn}>Sold out</Button>
                        <Button variant="info" size='sm' disabled={!newPlayerBtn} onClick={newPlayerBtnClicked}>New Player</Button>
                    </div>
                </div>
                <img src={sold} className={soldActive ? "active" : "d-none"} width={150} />
            </div>
        )): (<><h2>Auction ended</h2></>)
    )
}

export default BidPlayerBox
