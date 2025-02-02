import React, { useContext, useEffect, useRef, useState } from 'react'
import userPp from '../userPP.svg'
import Button from 'react-bootstrap/Button'
import sold from '../sold-removebg-preview.png'
import { ContextAuth } from '../App'
import axios from 'axios'

const BidPlayerBox = ({playerName, playerCat, playerBidVal, playerSpec}) => {
    let url = 'http://localhost:5000/playersCategory'
    const{loginPage, setLoginPage,loggedOut, setLoggedOut,bid, setBid,turn, setTurn, newPlayerBtn, setNewPlayerBtn} = useContext(ContextAuth)
    const randomPlayerChange = useRef([playerName, playerCat, playerBidVal, playerSpec])
    

    const bidBtnClick = () => {
        setBid(bid + 50)
        if(turn == 1){
            setTurn(turn + 1);
        }else{
            setTurn(turn - 1);
        }       
    }

    const soldBtnClick = () => {
        setNewPlayerBtn(true)
    }

    const newPlayerBtnClicked = () => {
        setNewPlayerCalled(true);
        setNewPlayerBtn(false);
        axios.get(url)
        .then((res)=> {
            let randomNum = Math.floor(Math.random()*(res.data.length-1+1)+1)
            randomPlayerChange.current = res.data.filter((fl)=>fl.id == randomNum)
        })
    }

    return (
        <div className='auction_box_player_section'>
            <div className='auction_box_player_section_details bg-light border p-3 rounded shadow'>
                <h2 className='text-center bg-dark text-light p-2 rounded'>{randomPlayerChange.current[0]}</h2>
                <div className='auction_box_player_section_details_img text-center mb-2'>
                    <img src={userPp} alt='Player Image' width={200} />
                </div>
                <div className='auction_box_player_section_details_typ'>
                    <div className='row'>
                        <div className='col-6'>
                            <label><strong>Category:</strong> {randomPlayerChange.current[1]}</label>
                        </div>
                        <div className='col-6'><label><strong>Bid price</strong> {randomPlayerChange.current[2]}</label></div>
                        <div className='col-12 mt-2'>
                            <label><strong>Specification:</strong> {randomPlayerChange.current[3]}</label>
                        </div>
                    </div>
                </div>
                <hr />
                <div className='auction_box_player_section_bid_input_box d-flex justify-content-between'>
                    <input className='form-control' type='number' value={bid} disabled/>
                    <Button variant="primary" size='sm' onClick={bidBtnClick} disabled={newPlayerBtn}>Increase Bid</Button>
                </div>
                <div className='mt-3 d-flex justify-content-center'>
                    <Button variant="danger" size='sm' disabled={newPlayerBtn}>Unsold</Button>
                    <Button variant="success" size='sm' className='mx-2' onClick={soldBtnClick} disabled={newPlayerBtn}>Sold out</Button>
                    <Button variant="info" size='sm' disabled={!newPlayerBtn} onClick={newPlayerBtnClicked}>New Player</Button>
                </div>
            </div>
            <img src={sold} width={150}/>
        </div>
    )
}

export default BidPlayerBox
