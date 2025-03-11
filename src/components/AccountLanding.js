import React, { useEffect, useRef, useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { Button, InputGroup } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from "react-redux";
import { formPageTrue } from "../features/ValidityChecks/formPageCheckSlice";
import { auctionPageTrue } from "../features/ValidityChecks/auctionPageCheckSlice";
import { urlParamSet } from "../features/UrlParam/urlParamSlice";
import { doSignOut } from "../firebase/auth";
import { setUserToken } from "../features/UserToken/userTokenSlice";
import { useAuth } from "../contexts/authContext";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { setLoader } from "../features/Loader/loaderSlice";
import { setAuctionData } from "../features/AuctionData/auctionDataSlice";


const AccountLanding = () => {
  const auctionData = useSelector((state)=>state.auctionData.value);
  const { userLoggedIn, currentUser } = useAuth();
  const dispatch = useDispatch();
  const param = useParams();
  const [dropDown, setDropDown] = useState(false);
  const [leftBox, setLeftBox] = useState(true);
  const [auctionField, setAuctionField] = useState(false);
  const [auctionVal, setAuctionVal] = useState("")
  const [auctionValEdit, setAuctionValEdit] = useState({
    isUpdate: false,
    toUpdateId: ""
  })
  const [userPhoto, setUserPhoto] = useState("");
  const userPhotoRef = useRef("");
  let navigate = useNavigate();

  const left_box_hide = {
    width: "0",
    background: "#ffffff",
    boxShadow: "4px 14px 14px #cecece",
    height: "calc(100vh - 56px)",
    position: "sticky",
    opacity: "0",
    transition: "all ease 0.8s"
  };

  const left_box_show = {
    width: "15%",
    background: "#ffffff",
    boxShadow: "4px 14px 14px #cecece",
    height: "calc(100vh - 56px)",
    position: "sticky",
    opacity: "1",
    transition: "all ease 0.8s"
  };

  const [active, setActive] = useState(1);
  let paramFirstName = param.name;
  paramFirstName = paramFirstName.split(" ").shift();
  useEffect(() => {

    if (userLoggedIn) {
      dispatch(setLoader(true))
      currentUser.photoURL != null ? userPhotoRef.current = currentUser.photoURL : userPhotoRef.current = ""
      dispatch(urlParamSet(param.name));
      const getUserDoc = doc(db, "users", currentUser.uid);
      const getAuctionsCollection = collection(getUserDoc, "auctions")
      getDocs(getAuctionsCollection).then((res) => {
        dispatch(setLoader(false))
        let auctionD = [];
        if(res._snapshot.docChanges.length > 0){
          res.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            let data = doc.data()
            data = {...data, id: doc.id}
            auctionD.push(data);
            // console.log(doc.id, " => ", doc.data());
          });
        }
        dispatch(setAuctionData(auctionD))
      })
    } else {
      navigate('/unauthorizedPage');
    }

  }, []);

  const redirctTo = () => {
    dispatch(setLoader(true))
    doSignOut()
      .then(() => (
        dispatch(setLoader(false)),
        localStorage.removeItem('token'),
        localStorage.removeItem('data'),
        dispatch(setUserToken("")),
        navigate("/login")
      ))
  };

  const handleAddAuction = () => {
    dispatch(setLoader(true));
    if (auctionValEdit.isUpdate) {
      const getUserToUpdate = doc(db, "users", currentUser.uid)
      const getAuctionCollectionToUpdate = collection(getUserToUpdate, "auctions")
      const updateCollection = doc(getAuctionCollectionToUpdate, auctionValEdit.toUpdateId);

      updateDoc(updateCollection,{
        auctionName:auctionVal
      }).then(()=>{
        const getUserDoc = doc(db, "users", currentUser.uid);
      const getAuctionsCollection = collection(getUserDoc, "auctions")
      getDocs(getAuctionsCollection).then((res) => {
        dispatch(setLoader(false))
        let auctionD = [];
        if(res._snapshot.docChanges.length > 0){
          res.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            let data = doc.data()
            data = {...data, id: doc.id}
            auctionD.push(data);
          });
        }
        dispatch(setAuctionData(auctionD))
        setAuctionField(!auctionField);
      })
      })
    } else {
      const getUserDoc = doc(db, "users", currentUser.uid);
      const auctionCollectionInsideUserDoc = collection(getUserDoc, "auctions")
      addDoc(auctionCollectionInsideUserDoc, { auctionName: auctionVal }).then((res) => {
        const getUserDoc = doc(db, "users", currentUser.uid);
        const getAuctionsCollection = collection(getUserDoc, "auctions")
        getDocs(getAuctionsCollection).then((res) => {
          dispatch(setLoader(false))
          let auctionD = [];
          if (res._snapshot.docChanges.length > 0) {
            res.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              let data = doc.data()
              data = { ...data, id: doc.id }
              auctionD.push(data);
              // console.log(doc.id, " => ", doc.data());
            });
            localStorage.setItem("auctionData",JSON.stringify([{auctionName:res._snapshot.docChanges[0].doc.data.value.mapValue.fields.auctionName, id:res._snapshot.docChanges[0].doc.key.path.segments[res._snapshot.docChanges[0].doc.key.path.segments.length - 1]
            }]))
            dispatch(setAuctionData(auctionD));
            setAuctionField(!auctionField);
            navigate(`${param.name}/formPage`)
          }
        })
      });
    }
  }

  const handleDelAuction = (id) => {
    dispatch(setLoader(true));
    const getUserDoc = doc(db, "users", currentUser.uid);
    const getAuctionsCollection = collection(getUserDoc, "auctions")

    deleteDoc(doc(getAuctionsCollection, id)).then(()=>{
      console.log(id + ' deleted');
      const getUserDoc = doc(db, "users", currentUser.uid);
      const getAuctionsCollection = collection(getUserDoc, "auctions")
      getDocs(getAuctionsCollection).then((res) => {
        dispatch(setLoader(false))
        let auctionD = [];
        if(res._snapshot.docChanges.length > 0){
          res.forEach((doc) => {
            let data = doc.data()
            data = {...data, id: doc.id}
            auctionD.push(data);
          });
        }
        dispatch(setAuctionData(auctionD))
      })
      
    })
  }

  const test = async () => {
    console.log('button clicjk')
    const getUserDoc = doc(db, "users", currentUser.uid);
    const getAuctionsCollection = collection(getUserDoc, "auctions")

    deleteDoc(doc(getAuctionsCollection, '6ywDTLcBj0QDUjrNqZQr')).then(()=>{
      console.log('6ywDTLcBj0QDUjrNqZQr id deleted')
    })
    
  }

  const createTeam = (id) => {
    let aucD = auctionData.filter((res) => res.id == id);
    localStorage.setItem('auctionData',JSON.stringify(aucD));
    console.log(aucD)
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
                className="d-flex p-3 userLogoutTab align-items-center"
                onClick={() => setDropDown(!dropDown)}
              >
                <span>Hi, {paramFirstName}</span>
                {userPhotoRef.current == "" || userPhotoRef.current == null ? <i className="bi bi-person-circle"></i> : <img src={userPhotoRef.current} />}

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
                  background: "#fff",
                  transition: "all ease .5s",
                  cursor: "pointer"
                }}
                className="shadow ps-0 logoutDropDwn"
              >
                <li className="py-3 pe-5 ps-3" onClick={redirctTo}>Logout</li>
              </ul>
            ) : null}
          </header>
          <section style={{ background: "#ececec" }}>
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
                    style={{ pointerEvents: "none" }}
                  >
                    Auction
                  </li>
                </ul>
              </div>
              <div className="right_box w-100">
                <div className="container">
                  <h2 className="m-3" style={{ borderBottom: "2px solid #09d409" }}>
                    {active == 1 ? "Dashboard" : "Auction"}
                  </h2>
                  {active == 1 ? (
                    <div className="container-fluid">
                      <div className="d-flex" style={{ gap: "5px" }}>
                        <div className="col-6 d-flex align-items-center p-3 shadow welcome_box rounded" style={{ background: "#fff" }}>
                          <i className="bi bi-person-circle"></i>
                          <p className="m-0 ms-2">Welcome {paramFirstName}</p>
                        </div>
                        <div className="col-6 d-flex align-items-center p-3 shadow rounded" style={{ background: "#fff" }}>
                          <div className="w-100">
                            <div className="d-flex justify-content-between">
                              <strong>My Auctions</strong>
                              {/* <button className="btn btn-danger" onClick={test}>test</button> */}
                              <Button variant="outline-dark" size="sm" onClick={() => { setAuctionField(!auctionField); setAuctionVal("") }}>{auctionField ? "Cancel" : "Create New Auction"}</Button>
                            </div>
                            {
                              auctionField && <InputGroup className="my-3">
                                <Form.Control
                                  aria-label="Example text with button addon"
                                  aria-describedby="basic-addon1"
                                  placeholder="Add Auction Name"
                                  value={auctionVal}
                                  onChange={(e) => { setAuctionVal(e.target.value) }}
                                />
                                <Button disabled={auctionVal.length == 0} variant="dark" id="button-addon1" onClick={() => handleAddAuction()}>
                                  Add
                                </Button>
                              </InputGroup>
                            }
                            {
                              auctionData.length > 0 ? auctionData.map((elm) => (
                                <>
                                  <div className="shadow-sm mt-3 py-2 px-3 d-flex justify-content-between" key={elm.id}>
                                    <p className="m-0">{elm.auctionName}</p>
                                    <div className="auctions_actionLinks">
                                      <Link
                                        to={`${param.name}/formPage`}
                                        className="link-underline link-underline-opacity-0 text-primary"
                                        onClick={() => (dispatch(formPageTrue()),createTeam(elm.id))}
                                      >
                                        Create Team / View
                                      </Link>
                                      <Link
                                        to="#"
                                        className="link-underline link-underline-opacity-0 ms-2 text-warning"
                                        onClick={() => { setAuctionField(true); setAuctionValEdit({ ...auctionValEdit, isUpdate: true, toUpdateId: elm.id },); setAuctionVal(elm.auctionName) }}
                                      >
                                        Edit
                                      </Link>
                                      <Link
                                        to={`${param.name}/liveAuction`}
                                        className="link-underline link-underline-opacity-0 ms-2 text-info"
                                        onClick={() => dispatch(auctionPageTrue())}
                                      >
                                        Live
                                      </Link>
                                      <Link
                                        to="#"
                                        className="link-underline link-underline-opacity-0 ms-2 text-danger"
                                        onClick={() => { handleDelAuction(elm.id) }}
                                      >
                                        Delete
                                      </Link>
                                    </div>
                                  </div>
                                </>
                              )) : null
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
