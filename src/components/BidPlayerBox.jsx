import React, { useContext, useEffect, useState } from 'react'
import userPp from '../userPP.svg'
import Button from 'react-bootstrap/Button'
import sold from '../sold-removebg-preview.png'
import { ContextAuth } from '../App'

const BidPlayerBox = () => {
    const{loginPage, setLoginPage,loggedOut, setLoggedOut,bid, setBid,turn, setTurn, newPlayerBtn, setNewPlayerBtn} = useContext(ContextAuth)
    

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
        setNewPlayerBtn(false);
        setBid(200)
    }
    
    return (
        <div className='auction_box_player_section'>
            <div className='auction_box_player_section_details bg-light border p-3 rounded shadow'>
                <h2 className='text-center bg-dark text-light p-2 rounded'>Shubham Rogye</h2>
                <div className='auction_box_player_section_details_img text-center mb-2'>
                    <img src={userPp} alt='Player Image' width={200} />
                </div>
                <div className='auction_box_player_section_details_typ'>
                    <div className='row'>
                        <div className='col-6'>
                            <label><strong>Category:</strong> Gold</label>
                        </div>
                        <div className='col-6'><label><strong>Bid price</strong> 200</label></div>
                        <div className='col-12 mt-2'>
                            <label><strong>Specification:</strong> All Rounder</label>
                        </div>
                    </div>
                </div>
                <hr />
                <div className='auction_box_player_section_bid_input_box d-flex justify-content-between'>
                    <input className='form-control' type='number' value={bid} disabled/>\
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
