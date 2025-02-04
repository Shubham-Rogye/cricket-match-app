import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ContextAuth } from '../App';

const AccountLanding = () => {
    const param = useParams();
    const [dropDown, setDropDown] = useState(false)
    const [leftBox, setLeftBox] = useState(true)
    const {loginPage, setLoginPage,loggedOut, setLoggedOut} = useContext(ContextAuth);
    let navigate = useNavigate();

    const left_box_hide = {
        width: "0",
        background: "#ffffff",
        boxShadow: "4px 14px 14px #cecece",
        height: "calc(100vh - 56px)",
        position: "sticky",
        overflow: "hidden"
    }

    const left_box_show = {
        width: "15%",
        background: "#ffffff",
        boxShadow: "4px 14px 14px #cecece",
        height: "calc(100vh - 56px)",
        position: "sticky"
    }

    const [active, setActive] = useState(1)

    useEffect(()=>{
        if(loggedOut){
            alert('Session expire login again');
            navigate('/login');
        }
    },[])

    const redirctTo = () => {
        navigate('/login');
        setLoggedOut(true)
    }
    return (
        <>
            <header className='d-flex user_account_nav py-3 px-4' >
                <div className='d-flex justify-content-between w-100'>
                    <i className={leftBox ? "bi bi-x" : "bi bi-list"} style={{ cursor: "pointer" }} onClick={() => setLeftBox(!leftBox)}></i>
                    <div className='d-flex' style={{ gap: "10px", cursor: "pointer" }} onClick={() => setDropDown(!dropDown)}>
                        <span>Hi, {param.name}</span>
                        <i className="bi bi-person-circle"></i>
                    </div>
                </div>
                {
                    dropDown ? (<ul style={{ position: "fixed", top: "50px", color: "#000", listStyle: "none", cursor: "pointer", right: "0" }} className='shadow py-3 pe-5 ps-3'>
                        <li onClick={redirctTo}>Logout</li>
                    </ul>) : null
                }
            </header>
            <section>
                <div className='account_dashboard d-flex'>
                    <div className='left_box' style={leftBox ? left_box_show : left_box_hide}>
                        <ul>
                            <li className={active == 1 ? "active" : ""} onClick={() => setActive(1)}>Dashboard</li>
                            <li className={active == 2 ? "active" : ""} onClick={() => setActive(2)}>Auction</li>
                        </ul>
                    </div>
                    <div className='right_box w-100'>
                        <div className='container'>
                            <h2 className='m-3'>{active == 1 ? "Dashboard" : "Auction"}</h2>
                            {
                                active == 1 ? (
                                    <div className='container-fluid'>
                                        <div className='row'>
                                            <div className='col-5 d-flex align-items-center ms-3 p-3 shadow welcome_box rounded'>
                                                <i class="bi bi-person-circle"></i>
                                                <p className='m-0 ms-2'>Welcome {param.name}</p>
                                            </div>
                                            <div className='col-5 d-flex align-items-center ms-3 p-3 shadow rounded'>
                                                <div className='w-100'>
                                                    <strong>My Auctions</strong>
                                                    <div className='shadow-sm mt-3 py-2 px-3'>
                                                        <p className='m-0'>IDFC Auction Demo</p>
                                                        <Link to='/formPage' className='link-underline link-underline-opacity-0 text-primary'>View</Link>
                                                        <Link to='#' className='link-underline link-underline-opacity-0 ms-2 text-warning'>Edit</Link>
                                                        <Link to='/liveAuction' className='link-underline link-underline-opacity-0 ms-2 text-info'>Live</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className='d-flex justify-content-center'>
                                            <div className='col-10'>
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">#</th>
                                                            <th scope="col">Team</th>
                                                            <th scope="col">Date</th>
                                                            <th scope="col">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>1</td>
                                                            <td>IDFC Auction Demo</td>
                                                            <td>01-01-2025</td>
                                                            <td>
                                                                <a href='#' className='link-underline link-underline-opacity-0 text-primary'><i class="bi bi-eye"></i>View</a>
                                                                <a href='#' className='link-underline link-underline-opacity-0 mx-4 text-warning'><i class="bi bi-pencil-square"></i>Edit</a>
                                                                <a href='#' className='link-underline link-underline-opacity-0 text-success-emphasis'><i class="bi bi-download"></i>Data export</a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>1</td>
                                                            <td>IDFC Auction Demo</td>
                                                            <td>01-01-2025</td>
                                                            <td>
                                                                <a href='#' className='link-underline link-underline-opacity-0 text-primary'><i class="bi bi-eye"></i>View</a>
                                                                <a href='#' className='link-underline link-underline-opacity-0 mx-4 text-warning'><i class="bi bi-pencil-square"></i>Edit</a>
                                                                <a href='#' className='link-underline link-underline-opacity-0 text-success-emphasis'><i class="bi bi-download"></i>Data export</a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>1</td>
                                                            <td>IDFC Auction Demo</td>
                                                            <td>01-01-2025</td>
                                                            <td>
                                                                <a href='#' className='link-underline link-underline-opacity-0 text-primary'><i class="bi bi-eye"></i>View</a>
                                                                <a href='#' className='link-underline link-underline-opacity-0 mx-4 text-warning'><i class="bi bi-pencil-square"></i>Edit</a>
                                                                <a href='#' className='link-underline link-underline-opacity-0 text-success-emphasis'><i class="bi bi-download"></i>Data export</a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>1</td>
                                                            <td>IDFC Auction Demo</td>
                                                            <td>01-01-2025</td>
                                                            <td>
                                                                <a href='#' className='link-underline link-underline-opacity-0 text-primary'><i class="bi bi-eye"></i>View</a>
                                                                <a href='#' className='link-underline link-underline-opacity-0 mx-4 text-warning'><i class="bi bi-pencil-square"></i>Edit</a>
                                                                <a href='#' className='link-underline link-underline-opacity-0 text-success-emphasis'><i class="bi bi-download"></i>Data export</a>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <nav aria-label="Page navigation example">
                                                    <ul class="pagination justify-content-center">
                                                        <li class="page-item">
                                                            <a class="page-link" href="#" aria-label="Previous">
                                                                <span aria-hidden="true">&laquo;</span>
                                                            </a>
                                                        </li>
                                                        <li class="page-item"><a class="page-link" href="#">1</a></li>
                                                        <li class="page-item"><a class="page-link" href="#">2</a></li>
                                                        <li class="page-item"><a class="page-link" href="#">3</a></li>
                                                        <li class="page-item">
                                                            <a class="page-link" href="#" aria-label="Next">
                                                                <span aria-hidden="true">&raquo;</span>
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>
                                    </>
                                )
                            }

                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AccountLanding
