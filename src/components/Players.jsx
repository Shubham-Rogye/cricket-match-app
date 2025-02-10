import React from 'react'
import userPp from '../userPP.svg'
import baller from '../ball.jpg'
import batsmen from '../bat.jpg'
import all_rounder from '../all_rounder.png'
import owner1 from '../team1.png'
import owner2 from '../team3.png'

const Players = ({ name, specification, category,bidPrice, soldPlayer, owner }) => {
    return (
        <>
            <div className='yet_to_auction_player bg-white d-flex shadow p-3 align-items-center rounded'>
                <div className='yet_to_auction_player_img'>
                    <img src={userPp} width="75" />
                </div>
                <div className='yet_to_auction_player_details px-3'>
                    <h3 className='m-0'>{name}</h3>
                    <span>{specification}</span><br />
                    <small>{category}</small>
                    {soldPlayer && <p className='m-0'><strong>SOLD AT</strong> {bidPrice}</p>}
                </div>
            </div>
            <div className='yet_to_auction_player_details_typeImg'>
                <img src={specification == 'Bowler' ? baller : (specification == 'Batsman' ? batsmen : all_rounder)} width={50} />
            </div>
            {soldPlayer && <div className='yet_to_auction_player_details_ownerImg' style={{ position: "absolute", top:"0", right:"0" }}>
                <img src={owner == 1 ? owner1 : owner2} width={50} />
            </div>}
        </>
    )
}

export default Players
