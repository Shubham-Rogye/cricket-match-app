import React, {useContext, useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useForm } from "react-hook-form"
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import uploadPhoto from '../uploadPP.jpg'
import axios from 'axios';
import { ContextAuth } from '../App';
import { Link, useNavigate } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';


const FormPagePlayer = () => {
    const{formPage, setFormPage,auctionPage, setAuctionPage} = useContext(ContextAuth)
    const [file, setFile] = useState("");
    const [formFilledData, setFormFilledData] = useState()
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
        console.log(data)

        var sentData = {
            "fullName": data.fullName,
            "category": data.category,
            "specification1": data.specification1,
            "specification2": data.specification2,
            "bidValue": data.bidValue,
            "mobileNo": data.mobileNo,
            "photo": [
                {
                    name: data.photo[0].name,
                    size: data.photo[0].size,
                    type: data.photo[0].type
                }
            ]
        }

        axios.post(url, sentData)
            .then((res) => {
                console.log('Record added');
                axios.get(url)
                .then((res) => {
                    setFormFilledData(res.data);                    
                })
            })
            console.log(formFilledData);
            setFile("")

        reset({
            photo:"",
            fullName: "",
            category: "",
            specification1: "",
            specification2: "",
            mobileNo: ""
        });
    }

    const uploadImg = (e) => {
        setFile(URL.createObjectURL(e.target.files[0]));
    }

    useEffect(()=>{
        axios.get(url)
                .then((res) => {
                    setFormFilledData(res.data);                    
                })
    },[])

    return (
        <>
            <div className='form_page px-5'>
            <form onSubmit={handleSubmit(onSubmit)} className='p-3 mt-3 shadow-lg'>
                <div className='page_title text-center'>
                    <h2 className='my-2'>Player Details</h2>
                </div>
                <hr />
                <div className='container'>
                    <div className='row form_row'>
                        <div className='col-12'>
                            <div className='profile_img_box d-flex justify-content-center p-3'>
                                <Form.Group controlId="formFile" className="text-center w-25">
                                    <Form.Label><img src={file ? file : uploadPhoto} width={120} /></Form.Label>
                                    <Form.Control type="file" accept='image/*'  {...register("photo", { required: true })} onChange={uploadImg} />
                                </Form.Group>
                                {errors.photo && <span className='error'>This field is required</span>}
                            </div>
                        </div>
                        <div className='col-6'>
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
                                <Form.Select aria-label="Floating label select example" {...register("category", { required: true })}>
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
                                <Form.Control type="number" value={watch("category") == "Gold" ? 1500 : watch("category") == "Platnium" ? 2000 : 500} disabled  {...register("bidValue", { required: true })} />
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
                    </div>
                </div>
                <div className='text-center my-3'>
                    <Button variant="dark" type="submit">Submit</Button>
                    <Link style={{textDecoration:"none"}} className='text-dark ms-3' onClick={()=>navigate(-1)}>Back</Link>
                </div>
            </form>
        </div>
            <Tabs
                defaultActiveKey="teams"
                transition={false}
                id="noanim-tab-example"
                className="my-3 justify-content-center"
            >
                <Tab eventKey="teams" title="Teams">
                    <div className='container'>
                        <table class="table table-light">
                            <thead>
                                <tr>
                                    <th scope="col">Id</th>
                                    <th scope="col">Logo</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Owner</th>
                                    <th scope="col">Total Points</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td >1</td>
                                    <td>Mark</td>
                                    <td>Chacha Phaltan</td>
                                    <td>Sanket Chacha</td>
                                    <td>6000</td>
                                    <td>
                                        <span>edit</span>
                                        <span>delete</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td >2</td>
                                    <td>Mark</td>
                                    <td>Pratz Warriors</td>
                                    <td>Prathmesh Desai</td>
                                    <td>6000</td>
                                    <td>
                                        <span>edit</span>
                                        <span>delete</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Tab>
                <Tab eventKey="category" title="Category">
                <div className='container'>
                        <table class="table table-light">
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
                                        <span>edit</span>
                                        <span>delete</span>
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
                                        <span>edit</span>
                                        <span>delete</span>
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
                                        <span>edit</span>
                                        <span>delete</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Tab>
                <Tab eventKey="players" title="Players">
                    <div className='container'>
                        <table class="table table-light">
                            <thead>
                                <tr>
                                    <th scope="col">Player</th>
                                    <th scope="col">Category</th>
                                    <th scope="col">Is verified</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    formFilledData ? formFilledData.map((elm) => (
                                        <tr key={elm.id}>
                                            <td><strong>{elm.fullName}</strong><br /><small>{elm.specification1}</small></td>
                                            <td><strong>{elm.category}</strong><br /><small>{elm.bidValue}</small></td>
                                            <td>True</td>
                                            <td>
                                                <span>edit</span>
                                                <span>delete</span>
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
