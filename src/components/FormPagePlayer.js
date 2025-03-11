import React, {useContext, useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useForm } from "react-hook-form"
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import uploadPhoto from '../uploadPP.jpg'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import owner1 from '../team1.png'
import owner2 from '../team3.png'
import { useDispatch, useSelector } from 'react-redux';
import { team } from '../features/TeamOwners/teamSlice';
import { db } from '../firebase/firebase';
import { addDoc, collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/authContext';
import { setLoader } from '../features/Loader/loaderSlice';

const FormPagePlayer = () => {
    const teamDB = useSelector((state)=>state.team.value);
    const auctionData = useSelector((state)=>state.auctionData.value);
    const { userLoggedIn, currentUser } = useAuth();
    const dispatch = useDispatch();
    const [file, setFile] = useState("");
    const [bidValue, setBidValue] = useState(500)
    const [formFilledData, setFormFilledData] = useState([])
    const [captains, setCaptains] = useState(false)
    const [switchOn, setSwitchOn] = useState(false);
    const [aucD, setAucD] = useState([]);
    let url = "http://localhost:5000/playersCategory"
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm()

    const onSubmit = (data) => {
        dispatch(setLoader(true));
        if(captains){
            var sentData = {
                "fullName": data.fullName,
                "category": data.category,
                "specification1": data.specification1,
                "specification2": data.specification2,
                "bidValue": bidValue,
                "mobileNo": data.mobileNo,
                "captain":switchOn,
                "photo": [
                    {
                        name: data.photo[0].name,
                        size: data.photo[0].size,
                        type: data.photo[0].type
                    }
                ]
            }
    
            setBidValue(500);
            setSwitchOn(false);
                
            const getAuthDoc = doc(db,"users", currentUser.uid,"auctions", aucD[0].id);
            const teamCollectionInsideAuctionDoc = collection(getAuthDoc, "players");

            addDoc(teamCollectionInsideAuctionDoc, sentData).then((res)=>{
                dispatch(setLoader(true));
                const getAuthDoc = doc(db, "users", currentUser.uid, "auctions", aucD[0].id);
                const teamCollectionInsideAuctionDoc = collection(getAuthDoc, "players");

                getDocs(teamCollectionInsideAuctionDoc).then((res)=>{
                    dispatch(setLoader(false));
                    let playerData = [];
                    if(res._snapshot.docChanges.length > 0){
                        res.forEach((doc) => {
                            let data = doc.data()
                            data = { ...data, id: doc.id };
                            playerData.push(data)
                        })
                    }
                    setFormFilledData(playerData)
                    console.log(data)
                }).catch(()=>console.log("error"))
            }).catch(()=>console.log("error"))
            setSwitchOn(false);
            setFile("");
    
            reset({
                photo:"",
                fullName: "",
                category: "",
                specification1: "",
                specification2: "",
                mobileNo: ""
            });

            

        } else{
            // console.log(data);
            const getAuctionrDoc = doc(db, "users", currentUser.uid, "auctions",aucD[0].id);
            const teamCollectionInsideAuctionDoc = collection(getAuctionrDoc, "teams");

            addDoc(teamCollectionInsideAuctionDoc,{"teams":[
                {
                    "logo": owner1,
                    "name":data.team1Name,
                    "owner":data.captain1fullName,
                    "points":Number(data.captain1points)
                  },
                  {
                    "logo": owner2,
                    "name":data.team2Name,
                    "owner":data.captain2fullName,
                    "points":Number(data.captain2points)
                  }
            ]} ).then((res)=>{
                dispatch(setLoader(true));
                const getAuctionrDoc = doc(db, "users", currentUser.uid, "auctions",aucD[0].id);
                const teamCollectionInsideAuctionDoc = collection(getAuctionrDoc, "teams");

                  getDocs(teamCollectionInsideAuctionDoc).then((res)=>{
                    dispatch(setLoader(false));
                    let teamData;
                    if(res._snapshot.docChanges.length > 0){
                        res.forEach((doc) => {
                          teamData = doc.data()
                        });
                      }
                      dispatch(team(teamData.teams));
                      setCaptains(true);
                  }).catch(()=>dispatch(setLoader(false)), console.log("error:",))
                  
                  
              }).catch(()=>dispatch(setLoader(false)), console.log("error:",))
        }
    }

    const uploadImg = (e) => {
        setFile(URL.createObjectURL(e.target.files[0]));
    }

    const handleDel = (id) => {
        debugger;
        axios.delete(url+"/"+id)
        .then((res)=>axios.get(url).then((res)=>setFormFilledData(res.data)))
        .catch((err)=>alert(err))
    }

    const handleEditl = (id) => {
        console.log(id)
    }

    const onSwitchChange = () => {
        setSwitchOn(!switchOn)
    }
    
    useEffect(()=>{
        dispatch(setLoader(true));
        setAucD(JSON.parse(localStorage.getItem('auctionData')));
        const getAuctionrDoc = doc(db, "users", currentUser.uid, "auctions", JSON.parse(localStorage.getItem('auctionData'))[0].id);
        const teamCollectionInsideAuctionDoc = collection(getAuctionrDoc, "teams");

        getDocs(teamCollectionInsideAuctionDoc).then((res) => {
            dispatch(setLoader(false));
            let teamData
            if(res._snapshot.docChanges.length > 0){
                res.forEach((doc) => {
                  teamData = doc.data()
                });
                dispatch(team(teamData.teams));
                 setCaptains(true)
              } else{
                dispatch(team([]));
                 setCaptains(false)
              }
              
        }).catch(() => dispatch(setLoader(false)), console.log("error"))

        const getAuthDoc = doc(db, "users", currentUser.uid, "auctions", JSON.parse(localStorage.getItem('auctionData'))[0].id);
        const teamCollectionInsidePlayersDoc = collection(getAuthDoc, "players");

        getDocs(teamCollectionInsidePlayersDoc).then((res) => {
            dispatch(setLoader(false));
            let playerData = [];
            if (res._snapshot.docChanges.length > 0) {
                res.forEach((doc) => {
                    let data = doc.data()
                    data = { ...data, id: doc.id };
                    playerData.push(data)
                })
            }
            setFormFilledData(playerData)
        }).catch(() => console.log("error"));
    },[])

    useEffect(()=>{
        teamDB.length == 2 && setCaptains(true);
    },[captains])

    return (
        <>
            <div className='form_page px-5'>
                <form onSubmit={handleSubmit(onSubmit)} className='p-3 mt-3 shadow-lg'>
                    <div className='page_title text-center'>
                        <h2 className='my-2'>{captains ? "Player Details" : "Add Owners"}</h2>
                    </div>
                    <hr />
                    <div className='container'>
                        <div className='row form_row'>
                            <div className='col-12'>
                                {captains && <div className='profile_img_box d-flex justify-content-center p-3'>
                                    <Form.Group controlId="formFile" className="text-center w-25">
                                        <Form.Label><img src={file ? file : uploadPhoto} width={120} /></Form.Label>
                                        <Form.Control type="file" accept='image/*'  {...register("photo", { required: true })} onChange={uploadImg} />
                                    </Form.Group>
                                    {errors.photo && <span className='error'>This field is required</span>}
                                </div>}
                            </div>
                            {
                                captains ? (<><div className='col-6'>
                                    <FloatingLabel
                                        controlId="floatingInput"
                                        label="Player Full Name"
                                    >
                                        <Form.Control type="text" placeholder="name@example.com" {...register("fullName", { required: true })} />
                                    </FloatingLabel>
                                    {errors.fullName && <span className='error'>This field is required</span>}
                                </div>
                            <div className='col-6'>
                                <FloatingLabel
                                    controlId="floatingInput"
                                    label="Category"
                                >
                                    <Form.Select aria-label="Floating label select example" {...register("category", { required: true, onChange: () => setBidValue(watch("category") == "Gold" ? 1500 : watch("category") == "Platnium" ? 2000 : 500) })}>
                                        <option ></option>
                                        <option value="Gold">Gold</option>
                                        <option value="Silver">Silver</option>
                                        <option value="Platnium">Platnium</option>
                                    </Form.Select>
                                </FloatingLabel>
                                {errors.category && <span className='error'>Please select anyone</span>}

                            </div>
                            <div className='col-6'>
                                <FloatingLabel
                                    controlId="floatingInput"
                                    label="Specification1"
                                >
                                    <Form.Select aria-label="Floating label select example" {...register("specification1", { required: true })}>
                                        <option ></option>
                                        <option value="Batsman">Batsman</option>
                                        <option value="Bowler">Bowler</option>
                                        <option value="All Rounder">All Rounder</option>
                                    </Form.Select>
                                </FloatingLabel>
                                {errors.specification1 && <span className='error'>Please select anyone</span>}
                            </div>
                            <div className='col-6'>
                                <FloatingLabel
                                    controlId="floatingInput"
                                    label="Specification2"
                                >
                                    <Form.Select aria-label="Floating label select example" {...register("specification2", { required: true })}>
                                        <option ></option>
                                        {watch('specification1') == 'Batsman' &&
                                            <>
                                                <option value="Right-Hand-Batsman">Right Hand Batsman</option>
                                                <option value="Left-Hand-Batsman">Left Hand Batsman</option>
                                            </>
                                        }
                                        {watch('specification1') == 'Bowler' &&
                                            <>
                                                <option value="Right-Arm Fast Bowler">Right Arm Fast Bowler</option>
                                                <option value="Left-Arm Fast Bowler">Left Arm Fast Bowler</option>
                                                <option value="Right-Arm-Off-spinner">Right Arm Off spinner</option>
                                                <option value="Left-Arm-Leg-spinner">Left Arm Off spinner</option>
                                                <option value="Right-Arm-Off-spinner">Right Arm Leg spinner</option>
                                                <option value="Left-Arm-Leg-spinner">Left Arm Leg spinner</option>
                                            </>
                                        }
                                        {watch('specification1') == 'All Rounder' &&
                                            <>
                                                <option value="Right-Hand-Batsman">Right Hand Batsman</option>
                                                <option value="Left-Hand-Batsman">Left Hand Batsman</option>
                                                <option value="Right-Arm Fast Bowler">Righ Arm Fast Bowler</option>
                                                <option value="Left-Arm Fast Bowler">Right Arm Fast Bowler</option>
                                                <option value="Right-Arm-Off-spinner">Right Arm Off spinner</option>
                                                <option value="Left-Arm-Leg-spinner">Left Arm Off spinner</option>
                                                <option value="Right-Arm-Off-spinner">Right Arm Leg spinner</option>
                                                <option value="Left-Arm-Leg-spinner">Left Arm Leg spinner</option>
                                            </>
                                        }

                                    </Form.Select>
                                </FloatingLabel>
                                {errors.specification2 && <span className='error'>Please select anyone</span>}
                            </div>
                            <div className='col-6'>
                                <FloatingLabel
                                    controlId="floatingInput"
                                    label="Min Bid Value"
                                >
                                    <Form.Control type="number" value={bidValue} disabled  {...register("bidValue", { required: true })} />
                                </FloatingLabel>
                                {errors.bidValue && <span className='error'>This field is required</span>}
                            </div>
                            <div className='col-6'>
                                <FloatingLabel
                                    controlId="floatingInput"
                                    label="Player Mobile number"
                                >
                                    <Form.Control type="number" placeholder="name@example.com" {...register("mobileNo", { required: true, minLength: { value: 10, message: "Please enter valid 10 digits mobile number" }, maxLength: { value: 10, message: "Please enter valid 10 digits mobile number" } })} />
                                </FloatingLabel>
                                {errors?.mobileNo?.type === "required" && <span className='error'>This field is required</span>}
                                {(errors?.mobileNo?.type === "minLength" || errors?.mobileNo?.type === "maxLength") && <span className='error'>{errors?.mobileNo?.message}</span>}
                            </div>
                            <div className='col-6'>
                                <Form.Check
                                    onChange={onSwitchChange}
                                    type="switch"
                                    id="custom-switch"
                                    label="Is Captain"
                                    checked={switchOn}
                                />
                            </div></>):(<div className='row'>
                                <strong>Owner 1 field</strong><hr />
                                <div className='col-6'>
                                    <FloatingLabel
                                        controlId="floatingInput"
                                        label="Owner 1 Name"
                                    >
                                        <Form.Control type="text" placeholder="name@example.com" {...register("captain1fullName", { required: true })} />
                                    </FloatingLabel>
                                    {errors.captain1fullName && <span className='error'>This field is required</span>}
                                </div>
                                <div className='col-6 my-2'>
                                    <FloatingLabel
                                        controlId="floatingInput"
                                        label="Team Name"
                                    >
                                        <Form.Control type="text" placeholder="name@example.com" {...register("team1Name", { required: true })} />
                                    </FloatingLabel>
                                    {errors.team1Name && <span className='error'>This field is required</span>}
                                </div>
                                <div className='col-6 mb-2'>
                                    <FloatingLabel
                                        controlId="floatingInput"
                                        label="Points"
                                    >
                                        <Form.Control type="number" placeholder="name@example.com" {...register("captain1points", { required: true })} />
                                    </FloatingLabel>
                                    {errors.captain1points && <span className='error'>This field is required</span>}
                                </div>
                                <strong>Owner 2 field</strong><hr />
                                <div className='col-6'>
                                    <FloatingLabel
                                        controlId="floatingInput"
                                        label="Owner 2 Name"
                                    >
                                        <Form.Control type="text" placeholder="name@example.com" {...register("captain2fullName", { required: true })} />
                                    </FloatingLabel>
                                    {errors.captain2fullName && <span className='error'>This field is required</span>}
                                </div>
                                <div className='col-6 my-2'>
                                    <FloatingLabel
                                        controlId="floatingInput"
                                        label="Team Name"
                                    >
                                        <Form.Control type="text" placeholder="name@example.com" {...register("team2Name", { required: true })} />
                                    </FloatingLabel>
                                    {errors.team2Name && <span className='error'>This field is required</span>}
                                </div>
                                <div className='col-6'>
                                    <FloatingLabel
                                        controlId="floatingInput"
                                        label="Points"
                                    >
                                        <Form.Control type="number" placeholder="name@example.com" {...register("captain2points", { required: true })} />
                                    </FloatingLabel>
                                    {errors.captain2points && <span className='error'>This field is required</span>}
                                </div>
                            </div>)
                            }
                            
                            
                        </div>
                    </div>
                    <div className='text-center my-3'>
                        <Button variant="dark" type="submit">Submit</Button>
                        <Link style={{ textDecoration: "none" }} className='text-dark ms-3' onClick={() => navigate(-1)}>Back</Link>
                    </div>
                </form>
            </div>
            <Tabs
                defaultActiveKey="teams"
                transition={false}
                id="noanim-tab-example"
                className="my-3 justify-content-center form_page_tabs"
            >
                <Tab eventKey="teams" title="Teams">
                    <div className='container'>
                        <table className = "table table-light">
                            <thead>
                                <tr>
                                    <th scope="col">Id</th>
                                    <th scope="col">Logo</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Owner/Captain</th>
                                    <th scope="col">Total Points</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    teamDB.map((elm, index) => (
                                        <tr key={elm.id}>
                                            <td>{index + 1}</td>
                                            <td><img src={elm.logo} /></td>
                                            <td>{elm.name}</td>
                                            <td>{elm.owner}</td>
                                            <td>{elm.points}</td>
                                            <td>
                                                <a href='#'><i className = "bi bi-pencil-fill"></i>Edit</a>
                                                <a href='#'><i className = "bi bi-trash3"></i>Delete</a>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </Tab>
                <Tab eventKey="category" title="Category">
                    <div className='container'>
                        <table className = "table table-light">
                            <thead>
                                <tr>
                                    <th scope="col">Id</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Player Base Price</th>
                                    <th scope="col">Min player per team</th>
                                    <th scope="col">Max player per team</th>
                                    <th scope="col">Min bid increment</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td >1</td>
                                    <td>Platinum</td>
                                    <td>1500</td>
                                    <td>0</td>
                                    <td>4</td>
                                    <td>500</td>
                                    <td>
                                        <a href='#'><i className = "bi bi-pencil-fill"></i>Edit</a>
                                        <a href='#'><i className = "bi bi-trash3"></i>Delete</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td >2</td>
                                    <td>Gold</td>
                                    <td>1000</td>
                                    <td>0</td>
                                    <td>1</td>
                                    <td>500</td>
                                    <td>
                                        <a href='#'><i className = "bi bi-pencil-fill"></i>Edit</a>
                                        <a href='#'><i className = "bi bi-trash3"></i>Delete</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td >3</td>
                                    <td>Silver</td>
                                    <td>500</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>100</td>
                                    <td>
                                        <a href='#'><i className = "bi bi-pencil-fill"></i>Edit</a>
                                        <a href='#'><i className = "bi bi-trash3"></i>Delete</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Tab>
                <Tab eventKey="players" title="Players">
                    <div className='container'>
                        <table className = "table table-light">
                            <thead>
                                <tr>
                                    <th scope="col">Player</th>
                                    <th scope="col">Category</th>
                                    <th scope="col">Captain</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    formFilledData ? formFilledData.map((elm) => (
                                        <tr key={elm.id}>
                                            <td><strong>{elm.fullName}</strong><br /><small>{elm.specification1}</small></td>
                                            <td><strong>{elm.category}</strong><br /><small>{elm.bidValue}</small></td>
                                            <td><i className = {elm.captain ? "bi bi-check-lg" : "bi bi-ban"}></i></td>
                                            <td>
                                                <a onClick={() => handleEditl(elm.id)}><i className = "bi bi-pencil-fill"></i>Edit</a>
                                                <a onClick={() => handleDel(elm.id)}><i className = "bi bi-trash3"></i>Delete</a>
                                            </td>
                                        </tr>
                                    )) : null
                                }
                            </tbody>
                        </table>

                    </div>
                </Tab>
            </Tabs>
        </>
    )
}

export default FormPagePlayer
