import React from 'react'

const LastMatchBoxComp = ({date, team1, team2, score1, score2, over1, over2, matchWontext}) => {
    return (
        <>
        <div className='col-sm-12 col-lg-6'>
            <div className='last_name_result_box px-5 py-3 shadow'>
                <p className='text-center'>{date}</p>
                <div className='last_name_result_box_versus d-flex justify-content-between align-items-center'>
                    <img src={team1} />
                    <div className='last_name_result_box_scores d-flex'>
                        <div className='last_name_result_box_scores_team_left'>
                            <h2>{score1}</h2>
                            <small style={{ color: "#929292" }}>{over1}</small>
                        </div>
                        <div className='last_name_result_box_scores_team_right won'>
                            <h2>{score2}</h2>
                            <small style={{ color: "#929292" }}>{over2}</small>
                        </div>
                    </div>
                    <img src={team2} />
                </div>
                <p className='text-center'>{matchWontext}</p>
            </div>
        <br/>
        </div> 
        </>
    )
}

export default LastMatchBoxComp
