import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { ContextAuth } from "../App";

const AccountLanding = () => {
  const param = useParams();
  const [dropDown, setDropDown] = useState(false);
  const [leftBox, setLeftBox] = useState(true);
  const navigationEntries = window.performance.getEntriesByType("navigation");
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
    overflow: "hidden",
  };

  const left_box_show = {
    width: "15%",
    background: "#ffffff",
    boxShadow: "4px 14px 14px #cecece",
    height: "calc(100vh - 56px)",
    position: "sticky",
  };

  const [active, setActive] = useState(1);

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
  }, []);

  const redirctTo = () => {
    navigate("/login");
    setLoggedOut(true);
  };
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
                <span>Hi, {param.name}</span>
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
                      <div className="row">
                        <div className="col-5 d-flex align-items-center ms-3 p-3 shadow welcome_box rounded" style={{background:"#fff"}}>
                          <i className="bi bi-person-circle"></i>
                          <p className="m-0 ms-2">Welcome {param.name}</p>
                        </div>
                        <div className="col-5 d-flex align-items-center ms-3 p-3 shadow rounded" style={{background:"#fff"}}>
                          <div className="w-100">
                            <strong>My Auctions</strong>
                            <div className="shadow-sm mt-3 py-2 px-3">
                              <p className="m-0">IDFC Auction Demo</p>
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
                            </div>
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
