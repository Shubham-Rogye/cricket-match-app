import React from 'react'
import team1 from '../team1.png'
import team2 from '../team2.png'
import team3 from '../team3.png'
import team4 from '../team4.png'
import LastMatchBoxComp from './LastMatchBoxComp'

const LastMatchResult = () => {
    return (
        <section className='last_name_result pb-5'>
            <div className='container'>
                <div>
                    <div className='p-5 text-center last_name_result_title'>
                        <h2>Last match result</h2>
                    </div>
                    <div className='last_name_result_boxes'>
                        <div className='container-fluid'>
                            <div className='row'>
                                <LastMatchBoxComp date="May 11, 2021" team1={team1} team2={team2} score1="160/5" score2="161/3" over1="20 over" over2="18 over" matchWontext = "Cricket club Won by 7 Wickets"/>
                                <LastMatchBoxComp date="May 11, 2021" team1={team3} team2={team4} score1="160/5" score2="161/3" over1="20 over" over2="18 over" matchWontext = "Cricket club Won by 7 Wickets" />
                                {/* <div className='col-6'>
                                    <div className='last_name_result_box p-3'>
                                        <p className='text-center'>May 11, 2021</p>
                                        <div className='last_name_result_box_versus d-flex justify-content-between align-items-center'>
                                            <img src={team3} />
                                            <div className='last_name_result_box_scores d-flex'>
                                                <div className='last_name_result_box_scores_team_left'>
                                                    <h3>192/7</h3>
                                                    <small>20 over</small>
                                                </div>
                                                <div className='last_name_result_box_scores_team_right'>
                                                    <h3>180/10</h3>
                                                    <small>19.3 over</small>
                                                </div>
                                            </div>
                                            <img src={team4} />
                                        </div>
                                        <p className='text-center'>Cricket champion Won by 12 runs</p>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LastMatchResult
