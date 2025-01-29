import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const AccountLanding = () => {
    const param = useParams();
    const [dropDown, setDropDown] = useState(false)
    let navigate = useNavigate();

    const redirctTo = () => {
        navigate('/login');
    }
    return (
        <>
            <header className='d-flex justify-content-end user_account_nav py-3 pe-4' >
                <div className='d-flex' style={{gap:"10px", cursor:"pointer"}} onClick={() => setDropDown(!dropDown)}>
                    <span>Hi, {param.name}</span>
                    <i className="bi bi-person-circle"></i>
                </div>
                {
                    dropDown ? (<ul style={{position:"fixed", top:"50px", color:"#000", listStyle:"none", cursor:"pointer"}} className='shadow py-3 pe-5 ps-3'>
                        <li onClick={redirctTo}>Logout</li>
                    </ul>) : null
                }
            </header>
            <section>
                <div>
                    <h1>Welcome {param.name}</h1>
                </div>
            </section>
        </>
    )
}

export default AccountLanding
