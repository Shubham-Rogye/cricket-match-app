import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { ContextAuth } from "../App";
import { Button, InputGroup } from "react-bootstrap";
import axios from "axios";
import Form from 'react-bootstrap/Form';

const AccountLanding = () => {
  const auctionDBurl = "http://localhost:7000/auctions"
  const param = useParams();
  const [dropDown, setDropDown] = useState(false);
  const [leftBox, setLeftBox] = useState(true);
  const [auctionField, setAuctionField] = useState(false);
  const [auctions, setAuctions] = useState([]);
  const navigationEntries = window.performance.getEntriesByType("navigation");
  const [auctionVal, setAuctionVal] = useState("")
  const [auctionValEdit, setAuctionValEdit] = useState({
    isUpdate: false,
    toUpdateId:""
  })
  const {
    loginPage,
    setLoginPage,
    loggedOut,
    setLoggedOut,
    loggedIn,
    setLoggedIn,
    formPage,
    setFormPage,
    auctionPage,
    setAuctionPage,
    userParamName, 
    setUserParamName
  } = useContext(ContextAuth);
  let navigate = useNavigate();

  const left_box_hide = {
    width: "0",
    background: "#ffffff",
    boxShadow: "4px 14px 14px #cecece",
    height: "calc(100vh - 56px)",
    position: "sticky",
    opacity:"0",
    transition:"all ease 0.8s"
  };

  const left_box_show = {
    width: "15%",
    background: "#ffffff",
    boxShadow: "4px 14px 14px #cecece",
    height: "calc(100vh - 56px)",
    position: "sticky",
    opacity:"1",
    transition:"all ease 0.8s"
  };

  const [active, setActive] = useState(1);
  let paramFirstName =  param.name;
  paramFirstName = paramFirstName.split(" ").shift();
  useEffect(() => {
    if ( (navigationEntries.length > 0 && navigationEntries[0].type === "reload")) {
        var alreadyLogin = true;
    } else {
      var alreadyLogin = false;
    }

    if (loggedOut) {
      alert("Session expire login again");
      navigate("/login");
    }
    if (!loggedIn && !alreadyLogin) {
      navigate("/unauthorizedPage");
    }
    
    setUserParamName(param.name);
    axios.get(auctionDBurl)
    .then((res)=>setAuctions(res.data))
    .catch((err)=>console.log(err))
  }, []);

  const redirctTo = () => {
    navigate("/login");
    setLoggedOut(true);
  };

  const handleAddAuction = () => {
    auctionValEdit.isUpdate ? axios.put(auctionDBurl+"/"+auctionValEdit.toUpdateId, {name:auctionVal})
    .then((res) => axios.get(auctionDBurl).then((res)=>setAuctions(res.data),setAuctionField(!auctionField))) :
    axios.post(auctionDBurl, {name:auctionVal})
    .then((res) => axios.get(auctionDBurl).then((res)=>setAuctions(res.data),setAuctionField(!auctionField)));
  }

  const handleDelAuction = (id) => {
    axios.delete(auctionDBurl+"/"+id)
    .then((res)=> axios.get(auctionDBurl).then((res)=>setAuctions(res.data)))
  }

  return (
    <>
      {window.location.href.includes('/liveAuction') || window.location.href.includes('/formPage') ? (
        <Outlet />
      ) : (
        <>
          <header className="d-flex user_account_nav ps-4">
            <div className="d-flex justify-content-between w-100 align-items-center">
              <i
                className={leftBox ? "bi bi-x" : "bi bi-list"}
                style={{ cursor: "pointer" }}
                onClick={() => setLeftBox(!leftBox)}
              ></i>
              <div
                className="d-flex p-3 userLogoutTab"
                onClick={() => setDropDown(!dropDown)}
              >
                <span>Hi, {paramFirstName}</span>
                <i className="bi bi-person-circle"></i>
              </div>
            </div>
            {dropDown ? (
              <ul
                style={{
                  position: "fixed",
                  top: "55px",
                  color: "#000",
                  listStyle: "none",
                  cursor: "pointer",
                  right: "12px",
                  background:"#fff",
                  transition:"all ease .5s",
                  cursor:"pointer"
                }}
                className="shadow ps-0 logoutDropDwn"
              >
                <li className="py-3 pe-5 ps-3" onClick={redirctTo}>Logout</li>
              </ul>
            ) : null}
          </header>
          <section style={{background:"#ececec"}}>
            <div className="account_dashboard d-flex">
              <div
                className="left_box"
                style={leftBox ? left_box_show : left_box_hide}
              >
                <ul>
                  <li
                    className={active == 1 ? "active" : ""}
                    onClick={() => setActive(1)}
                  >
                    Dashboard
                  </li>
                  <li
                    className={active == 2 ? "active" : ""}
                    onClick={() => setActive(2)}
                    style={{pointerEvents:"none"}}
                  >
                    Auction
                  </li>
                </ul>
              </div>
              <div className="right_box w-100">
                <div className="container">
                  <h2 className="m-3" style={{borderBottom:"2px solid #09d409"}}>
                    {active == 1 ? "Dashboard" : "Auction"}
                  </h2>
                  {active == 1 ? (
                    <div className="container-fluid">
                      <div className="d-flex" style={{gap:"5px"}}>
                        <div className="col-6 d-flex align-items-center p-3 shadow welcome_box rounded" style={{background:"#fff"}}>
                          <i className="bi bi-person-circle"></i>
                          <p className="m-0 ms-2">Welcome {paramFirstName}</p>
                        </div>
                        <div className="col-6 d-flex align-items-center p-3 shadow rounded" style={{background:"#fff"}}>
                          <div className="w-100">
                            <div className="d-flex justify-content-between">
                                <strong>My Auctions</strong>
                                <Button variant="outline-dark" size="sm" onClick={()=>{setAuctionField(!auctionField); setAuctionVal("")}}>{auctionField ? "Cancel" : "Create New Auction"}</Button>
                            </div>
                              {
                                auctionField && <InputGroup className="my-3">
                                <Form.Control
                                  aria-label="Example text with button addon"
                                  aria-describedby="basic-addon1"
                                  placeholder="Add Auction Name"
                                  value={auctionVal}
                                  onChange={(e) => {setAuctionVal(e.target.value)}}
                                />
                                <Button disabled={auctionVal.length == 0} variant="dark" id="button-addon1" onClick={()=>handleAddAuction()}>
                                  Add
                                </Button>
                              </InputGroup>
                              }
                              {
                                auctions.length > 0 ? auctions.map((elm)=>(
                                  <>
                                    <div className="shadow-sm mt-3 py-2 px-3 d-flex justify-content-between" key={elm.id}>
                                      <p className="m-0">{elm.name}</p>
                                      <div className="auctions_actionLinks">
                                        <Link
                                          to={`${param.name}/formPage`}
                                          className="link-underline link-underline-opacity-0 text-primary"
                                          onClick={() => setFormPage(true)}
                                        >
                                          View
                                        </Link>
                                        <Link
                                          to="#"
                                          className="link-underline link-underline-opacity-0 ms-2 text-warning"
                                          onClick={() => {setAuctionField(true); setAuctionValEdit({...auctionValEdit, isUpdate:true, toUpdateId:elm.id}, ); setAuctionVal(elm.name)}}
                                        >
                                          Edit
                                        </Link>
                                        <Link
                                          to={`${param.name}/liveAuction`}
                                          className="link-underline link-underline-opacity-0 ms-2 text-info"
                                          onClick={() => setAuctionPage(true)}
                                        >
                                          Live
                                        </Link>
                                        <Link
                                          to="#"
                                          className="link-underline link-underline-opacity-0 ms-2 text-danger"
                                          onClick={() => {handleDelAuction(elm.id)}}
                                        >
                                          Delete
                                        </Link>
                                      </div>
                                    </div>
                                  </>
                                )):null
                              }
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="d-flex justify-content-center">
                        <div className="col-12 p-3 bg-light">
                          <table className="table table-hover">
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
                                  <a
                                    href="#"
                                    className="link-underline link-underline-opacity-0 text-primary"
                                  >
                                    <i className="bi bi-eye"></i>View
                                  </a>
                                  <a
                                    href="#"
                                    className="link-underline link-underline-opacity-0 mx-4 text-warning"
                                  >
                                    <i className="bi bi-pencil-square"></i>Edit
                                  </a>
                                  <a
                                    href="#"
                                    className="link-underline link-underline-opacity-0 text-success-emphasis"
                                  >
                                    <i className="bi bi-download"></i>Data export
                                  </a>
                                </td>
                              </tr>
                              <tr>
                                <td>1</td>
                                <td>IDFC Auction Demo</td>
                                <td>01-01-2025</td>
                                <td>
                                  <a
                                    href="#"
                                    className="link-underline link-underline-opacity-0 text-primary"
                                  >
                                    <i className="bi bi-eye"></i>View
                                  </a>
                                  <a
                                    href="#"
                                    className="link-underline link-underline-opacity-0 mx-4 text-warning"
                                  >
                                    <i className="bi bi-pencil-square"></i>Edit
                                  </a>
                                  <a
                                    href="#"
                                    className="link-underline link-underline-opacity-0 text-success-emphasis"
                                  >
                                    <i className="bi bi-download"></i>Data export
                                  </a>
                                </td>
                              </tr>
                              <tr>
                                <td>1</td>
                                <td>IDFC Auction Demo</td>
                                <td>01-01-2025</td>
                                <td>
                                  <a
                                    href="#"
                                    className="link-underline link-underline-opacity-0 text-primary"
                                  >
                                    <i className="bi bi-eye"></i>View
                                  </a>
                                  <a
                                    href="#"
                                    className="link-underline link-underline-opacity-0 mx-4 text-warning"
                                  >
                                    <i className="bi bi-pencil-square"></i>Edit
                                  </a>
                                  <a
                                    href="#"
                                    className="link-underline link-underline-opacity-0 text-success-emphasis"
                                  >
                                    <i className="bi bi-download"></i>Data export
                                  </a>
                                </td>
                              </tr>
                              <tr>
                                <td>1</td>
                                <td>IDFC Auction Demo</td>
                                <td>01-01-2025</td>
                                <td>
                                  <a
                                    href="#"
                                    className="link-underline link-underline-opacity-0 text-primary"
                                  >
                                    <i className="bi bi-eye"></i>View
                                  </a>
                                  <a
                                    href="#"
                                    className="link-underline link-underline-opacity-0 mx-4 text-warning"
                                  >
                                    <i className="bi bi-pencil-square"></i>Edit
                                  </a>
                                  <a
                                    href="#"
                                    className="link-underline link-underline-opacity-0 text-success-emphasis"
                                  >
                                    <i className="bi bi-download"></i>Data export
                                  </a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <nav aria-label="Page navigation example">
                            <ul className="pagination justify-content-center">
                              <li className="page-item">
                                <a
                                  className="page-link"
                                  href="#"
                                  aria-label="Previous"
                                >
                                  <span aria-hidden="true">&laquo;</span>
                                </a>
                              </li>
                              <li className="page-item">
                                <a className="page-link" href="#">
                                  1
                                </a>
                              </li>
                              <li className="page-item">
                                <a className="page-link" href="#">
                                  2
                                </a>
                              </li>
                              <li className="page-item">
                                <a className="page-link" href="#">
                                  3
                                </a>
                              </li>
                              <li className="page-item">
                                <a className="page-link" href="#" aria-label="Next">
                                  <span aria-hidden="true">&raquo;</span>
                                </a>
                              </li>
                            </ul>
                          </nav>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default AccountLanding;
