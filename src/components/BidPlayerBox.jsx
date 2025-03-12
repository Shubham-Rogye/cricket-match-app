import React, { useContext, useEffect, useRef, useState } from 'react'
import userPp from '../userPP.svg'
import Button from 'react-bootstrap/Button'
import sold from '../sold-removebg-preview.png'
import unsold from "../unSold.png"
import eliminate from "../eliminatePNG.png"
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { player1turn, player2turn } from '../features/UserTurn/userTurnSlice'
import { incrementBid, setBidValue } from '../features/BidAmount/bidAmountSlice'
import { newPlayerFalse, newPlayerTrue } from '../features/ValidityChecks/newPlayerButtonSlice'
import { auctionEndedTrue } from '../features/ValidityChecks/auctionEndedCheckSlice'
import { updateTeamPoints } from '../features/TeamOwners/teamSlice'
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { setLoader } from '../features/Loader/loaderSlice';
import { useAuth } from '../contexts/authContext';


const BidPlayerBox = ({ playerName, playerCat, playerBidVal, playerSpec, playerSpec1, playerId }) => {
    let playerTurn = useSelector((state)=>state.turn.value);
    let pointCheck = (playerTurn == 1 ? 2 : 1) - 1
    let bidAmount = useSelector((state)=>state.bid.value);
    let newPlayerButton = useSelector((state)=>state.newPlayer.value);
    const auctionEndedCheck = useSelector((state)=>state.auctionEnded.value);
    const teamDB = useSelector((state)=>state.team.value);
    const urlParamSet = useSelector((state)=>state.urlParam.value);
    const dispatch = useDispatch();
    const {currentUser} = useAuth();
    const [aucD, setAucD] = useState(JSON.parse(localStorage.getItem('auctionData')));

    var getAucDoc = doc(db, "users", currentUser.uid, "auctions", aucD[0].id);
    var getPlayerCollection = collection(getAucDoc, "players");
    var getSoldPlayerCollection = collection(getAucDoc, "soldPlayers");
    var getUnSoldPlayerCollection = collection(getAucDoc, "unsoldPlayers");
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

    // const [maxPlayers, setMaxPlayers] = useState(0);
    const [unSoldBtnDisable, setUnSoldBtnDisable] = useState(false);
    const [unSoldPlayerList, setUnSoldPlayerList] = useState(false);
    const [unSoldImage, setUnSoldImg] = useState(false)
    const [eliminateImage, setEliminateImg] = useState(false)
    
    const teamS = useRef(teamDB)
    

    // useEffect(()=>{
    //     const timer = timerCount > 0 && setInterval(()=> setTimerCount(timerCount - 1),1000);
        
    //     if (timerCount == 0) {
    //         getDocs(getPlayerCollection)
    //         .then((res) => {
    //             dispatch(setLoader(true));
    //             let playerData = [];
    //             if (res._snapshot.docChanges.length > 0) {
    //                 res.forEach((doc) => {
    //                     let data = doc.data()
    //                     data = { ...data, id: doc.id };
    //                     playerData.push(data)
    //                 })
    //             }
    //             let playerSoldId = playerData.filter((playerID)=>playerID.id == playerID)    
    //             deleteDoc(doc(getPlayerCollection, playerSoldId[0].id))
    //             .then((res) => {
    //                 dispatch(setLoader(true));
    //                 console.log('record deleted');
    //                 addDoc(getUnSoldPlayerCollection, forUnsold)
    //                 .then((res) => {
    //                     dispatch(setLoader(false));
    //                     setUnSoldImg(true);
    //                     setSoldActive(true);
    //                     dispatch(newPlayerTrue());
    //                     console.log('player add to unSold')
    //                 })
    //                 .catch((err) => {
    //                     dispatch(setLoader(false));
    //                     console.log("err:", err);
    //                 })
    //             })
    //             .catch((err) => {
    //                 console.log("err:", err);
    //                 dispatch(setLoader(false));
    //             })
                    
    
    //         })
    //         // axios.delete(url + "/" + playerId)
    //         // .then((res) => console.log('record deleted'))
    //         // .catch((err) => console.log(err))
    //         // axios.post(unsoldPlayersURL, forUnsold)
    //         // .then((res) => console.log('player add to unSold'))
    //         // setUnSoldImg(true);
    //         // setSoldActive(true);
    //         // dispatch(newPlayerTrue());
    //     }

    //     if(newPlayerButton){
    //         clearInterval(timer);
    //     }
    //     return () => clearInterval(timer);
    // },[timerCount])

    // useEffect(()=>{
        
    //     // axios.get(url)
    //     // .then((res)=> (res.data.length-2) % 2 === 0 ? setMaxPlayers(res.data.length/2 - 1):setMaxPlayers(res.data.length/2 - 1.5))
    // },[])


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
        dispatch(setLoader(true));
        if(teamDB[(playerTurn == 1 ? 2 : 1) - 1].points < bidAmount){
            alert("You don't have sufficient points to buy");
        }else{            
            getDocs(getPlayerCollection)
            .then((res) => {
                let playerData = [];
                if (res._snapshot.docChanges.length > 0) {
                    res.forEach((doc) => {
                        let data = doc.data()
                        data = { ...data, id: doc.id };
                        playerData.push(data)
                    })
                }
                let playerSoldId = playerData.filter((playerID)=>playerID.id == id)
                var newPoints = teamS.current[pointCheck].points - bidAmount;
                dispatch(updateTeamPoints({ pointCheck, newPoints }));
                randomPlayerChange.current[0].owner = playerTurn == 1 ? 2 : 1
                randomPlayerChange.current[0].bidValue = bidAmount;

                deleteDoc(doc(unSoldPlayerList ? getUnSoldPlayerCollection : getPlayerCollection, playerSoldId[0].id))
                .then((res) => {
                    console.log('record deleted');
                    addDoc(getSoldPlayerCollection, randomPlayerChange.current[0])
                    .then((res) => {
                        console.log('playerSold');
                        dispatch(setLoader(false));
                        setSoldActive(true)
                        setEliminateImg(false);
                        dispatch(newPlayerTrue());
                    })
                    .catch((err) => {
                        console.log("err:", err);
                        dispatch(setLoader(false));
                    })
                })
                .catch((err) => {
                    console.log("err:", err);
                    dispatch(setLoader(false));
                })
                    

            })
            .catch((err)=>{
                console.log("error:",err);
                dispatch(setLoader(false));
            })

            // axios.get(soldPlayersURL)
            // .then((res) => {
            //     var team1TotalPlayers = res.data.filter((elm)=>elm.owner == 1)
            //     var team2TotalPlayers = res.data.filter((elm)=>elm.owner == 2)

            //     if(playerTurn == 2 && team1TotalPlayers.length >= maxPlayers){
            //         alert(`Cannot add more than ${maxPlayers} players in one team, Please sell remaining players to team 2`)
            //     } else if(playerTurn == 1 && team2TotalPlayers.length >= maxPlayers){
            //         alert(`Cannot add more than ${maxPlayers} players in one team, Please sell remaining players to team 1`)
            //     } else{
            //         setSoldActive(true)
            //         setEliminateImg(false);
            //         dispatch(newPlayerTrue());
            //         var newPoints = teamS.current[pointCheck].points - bidAmount;
            //         dispatch(updateTeamPoints({pointCheck, newPoints}));
            //         randomPlayerChange.current[0].owner = playerTurn == 1 ? 2 : 1
            //         randomPlayerChange.current[0].bidValue = bidAmount;
            //         axios.delete(unSoldPlayerList ? unsoldPlayersURL + "/" + id : url + "/" + id)
            //             .then((res) => console.log('record deleted'))
            //             .catch((err) => console.log(err))

            //         axios.post(soldPlayersURL, randomPlayerChange.current[0])
            //             .then((res) => console.log('playerSold'))
            //     }
            // });

            
        }

    }

    const unsoldBtnClick = (id) => {       
        dispatch(setLoader(true));
        getDocs(getPlayerCollection)
        .then((res) => {
            let playerData = [];
            if (res._snapshot.docChanges.length > 0) {
                res.forEach((doc) => {
                    let data = doc.data()
                    data = { ...data, id: doc.id };
                    playerData.push(data)
                })
            }
            let playerSoldId = playerData.filter((playerID)=>playerID.id == id)

            deleteDoc(doc(getPlayerCollection, playerSoldId[0].id))
            .then((res) => {
                console.log('record deleted');
                addDoc(getUnSoldPlayerCollection, forUnsold)
                .then((res) => {
                    console.log('playerUnSold');
                    dispatch(setLoader(false));
                    dispatch(newPlayerTrue());
                    setSoldActive(true);
                })
                .catch((err) => {
                    console.log("err:", err);
                    dispatch(setLoader(false));
                })
            })
            .catch((err) => {
                console.log("err:", err);
                dispatch(setLoader(false));
            })               

        })
        
        // axios.get(unsoldPlayersURL)
        // .then((res) => {
        //     var playerPresent = res.data.filter((playerCheck)=> playerCheck.id === id);

        //     if(playerPresent.length > 0){
        //         setEliminateImg(true);
        //         axios.delete(unsoldPlayersURL + "/" + id)
        //         .then((res) => console.log('player eliminated'))
        //     } else {
        //         setUnSoldImg(true);
        //         axios.delete(url + "/" + id)
        //         .then((res) => console.log('record deleted'))
        //         .catch((err) => console.log(err))
        //         axios.post(unsoldPlayersURL, forUnsold)
        //         .then((res) => {
        //             console.log('player add to unSold');
        //         })
        //     }
        // })
    }

    const newPlayerBtnClicked = () => {
        dispatch(setLoader(true));

        getDocs(getPlayerCollection)
        .then((res)=>{
            let playerData = [];
            if (res._snapshot.docChanges.length > 0) {
                res.forEach((doc) => {
                    let data = doc.data()
                    data = { ...data, id: doc.id };
                    playerData.push(data)
                })
                const randomStringValues = [];
                playerData.filter((el) => el.captain == false && randomStringValues.push(el.id))

                let randomNum = Math.floor(Math.random() * randomStringValues.length);
                randomNum = randomStringValues[randomNum]
                randomPlayerChange.current = playerData.filter((fl) => fl.id == randomNum)

                if(randomPlayerChange.current.length == 0){
                    getDocs(getUnSoldPlayerCollection)
                    .then((res)=>{
                        dispatch(setLoader(false));
                        let playerData = [];
                        if(res._snapshot.docChanges.length > 0){
                            res.forEach((doc) => {
                                let data = doc.data()
                                data = { ...data, id: doc.id };
                                playerData.push(data)
                            })
                        }
                        const randomStringValues = [];
                        playerData.filter((el) => randomStringValues.push(el.id))
                        let randomNum = Math.floor(Math.random() * randomStringValues.length)
                        randomNum = randomStringValues[randomNum]
                        randomPlayerChange.current = playerData.filter((fl) => fl.id == randomNum)

                        if (randomPlayerChange.current.length == 0) {
                            dispatch(auctionEndedTrue());
                        } else {
                            setUnSoldPlayerList(true);
                            dispatch(setBidValue(parseInt(randomPlayerChange.current[0].bidValue)));
                        }
                    }).catch((err)=>{
                        console.log("Error:", err);
                        dispatch(setLoader(false));
                    })
                } else{
                    dispatch(setLoader(false));
                    setForUnsold({
                        id: randomPlayerChange.current[0].id,
                        bidValue: randomPlayerChange.current[0].bidValue,
                        category: randomPlayerChange.current[0].category,
                        fullName: randomPlayerChange.current[0].fullName,
                        specification1: randomPlayerChange.current[0].specification1,
                        specification2: randomPlayerChange.current[0].specification2
                    })
                    dispatch(setBidValue(parseInt(randomPlayerChange.current[0].bidValue)));
                }
                setUnSoldImg(false)
                setUnSoldBtnDisable(false)
                setTimerCount(30);
                setSoldActive(false);
                dispatch(newPlayerFalse());
                teamS.current = teamDB;
            }
        }).catch((err) => {
            console.log("Error:",err);
            dispatch(setLoader(false));
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
                <img src={unSoldImage ? unsold : eliminateImage ? eliminate : sold} className={soldActive ? "active" : "d-none"} width={150} />
            </div>
        )) : (<><Button onClick={() => navigate(`/welcome/${urlParamSet}`)} className='bg-danger'>Auction ended, Back To Dashboard
    </Button></>)
    )
}

export default BidPlayerBox
