import React, { useContext, useEffect, useState } from 'react'
import NavbarComp from './Navbar'
import { ContextAuth } from '../App'
import { useForm } from "react-hook-form"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Zoom, Slide, Bounce, ToastContainer, toast } from 'react-toastify';


const Login = () => {
  let URL = "http://localhost:4000/users"
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm(
    {
      criteriaMode: "all",
    }
  )

  const [registerUser, setRegisterUser] = useState({
    userFullName: "",
    userDOB: "",
    userEmail: "",
    userPassword: ""

  })
  const {loginPage, setLoginPage,loggedOut, setLoggedOut,loggedIn, setLoggedIn} = useContext(ContextAuth);
  const [accountRegistered, setAccountRegistered] = useState(true)
  const [passwordMatchCheck, setPasswordMatchCheck] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [getData, setGetData] = useState([])

  setLoginPage(true);

  const accountCheck = (e) => {
    e.preventDefault();
    setAccountRegistered(!accountRegistered);
    setShowPass(false)
    console.log(accountRegistered)
    reset();

  }

  const checkPassword = () => {
    const password = passwordMatchCheck;
    const passwordConfirm = watch("userConfirmPassword");

    if (password == passwordConfirm) {
      clearErrors("userConfirmPassword")
    } else {
      setError("userConfirmPassword", {
        type: "password mismatch",
        message: "Password did not match"
      });
    }
  }


  useEffect(() => {
    const db = watch("userDOB");

    if (db) {
      const dbDate = new Date(db).getFullYear();
      const currentDate = new Date().getFullYear();
      const age = currentDate - dbDate;
      if (age < 18) {
        setError("userDOB", {
          type: "too young",
          message: "Sorry bro! you're too young to use this.😊"
        });
      } else {
        clearErrors("userDOB")
      }
    }

  }, [watch("userDOB")]);

  useEffect(() => {
    setLoggedIn(false)
    axios.get(URL)
      .then((res) => {
        setGetData(res.data);
      })
      .catch((err) => console.log(err))
  }, [accountRegistered])

  const onSubmit = (data) => {

        if(accountRegistered){
          // let userFilteredData = []
          const userFilteredData = getData.filter((userData) => userData.userEmail == data.userEmail);

          if(userFilteredData.length > 0){
            if(userFilteredData[0].userPassword == data.userPassword){
              navigate(`/welcome/${userFilteredData[0].userFullName}`)
              setLoginPage(false);
              setLoggedIn(true);
              
              if(loggedOut){
                setLoggedOut(false)
              }
            } else{
            toast.error('Invalid password');
            reset();
            }
          } else{
            toast.error('Email is not registered, Please Sign up')
            // alert("Email is not registered")
          }
          console.log(userFilteredData);                   
        } else{
          axios.post(URL,registerUser)
          .then((res)=>{toast.success('data has been successfully registered'); reset();setAccountRegistered(!accountRegistered);})
        }
  };

  return (
    <>
      <NavbarComp valid={loginPage} />
      <section className='d-flex justify-content-center'>
        <div className='login_form_page w-50 shadow p-5 mt-5'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2>{accountRegistered ? "Login Here" : "Register Here"}</h2>
            <hr />

            {!accountRegistered ? (
              <>
                <div>
                  <label className='form-label'>Enter your Full name</label>
                  <input type='text' className={errors.userFullName ? 'form-control error' : 'form-control'} {...register("userFullName", { required: true, onChange: () => {setRegisterUser({...registerUser, userFullName:watch("userFullName")})}})} />
                  {errors.userFullName && <span className='errorMessage'>This field is required</span>}
                </div>

                <div>
                  <label className='form-label'>Enter your DOB</label>
                  <input type='date' className={errors.userDOB ? 'form-control error' : 'form-control'} {...register("userDOB", { required: true, onChange: () => {setRegisterUser({...registerUser, userDOB:watch("userDOB")})} })} />
                  {errors?.userDOB?.type === "too young" && <span className='errorMessage'>{errors.userDOB.message}</span>}
                  {errors?.userDOB?.type === "required" && <span className='errorMessage'>This field is required</span>}
                </div>
              </>
            ) : null}
            <div>
              <label className='form-label'>Enter your email address</label>
              <input type='email' className={errors.userEmail ? 'form-control error' : 'form-control'} autoComplete='off' {...register("userEmail", { required: true, onChange: () => {setRegisterUser({...registerUser, userEmail:watch("userEmail")})}})} />
              {errors.userEmail && <span className='errorMessage'>This field is required</span>}
            </div>
            <div className='password_box'>
            {accountRegistered && <i className={showPass ? 'bi bi-eye-slash-fill':'bi bi-eye-fill'} onClick={()=>setShowPass(!showPass)}></i>}
              <label className='form-label'>Enter your password</label>
              <input type={accountRegistered ? (showPass ? 'text':'password'): "password"} className={errors.userPassword ? 'form-control error' : 'form-control'} 
              {...register("userPassword", { 
                required: true, 
                minLength: { 
                  value: !accountRegistered ? 8 : 0, 
                  message: !accountRegistered && "Password must be at least 8 characters" 
                },
                pattern: !accountRegistered && /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/,
                onChange: () => { setPasswordMatchCheck(watch("userPassword")); setRegisterUser({...registerUser, userPassword:watch("userPassword")})} })} />
              {errors?.userPassword?.type === "required" && <span className='errorMessage'>This field is required</span>}
              {!accountRegistered && <>{errors?.userPassword?.type === "minLength" && <span className='errorMessage'>{errors.userPassword.message}</span>}{errors?.userPassword?.type === "pattern" && <span className='errorMessage'>Password must contain aleast 1 capital letter & 1 number</span>}</>}
            </div>
            {!accountRegistered ? (
              <>
                <div className='password_box'>
                <i className={showPass ? 'bi bi-eye-slash-fill':'bi bi-eye-fill'} onClick={()=>setShowPass(!showPass)}></i>
                  <label className='form-label'>Confirm password</label>
                  <input type={showPass ? 'text':'password'} className={errors.userConfirmPassword ? 'form-control error' : 'form-control'} {...register("userConfirmPassword", { required: true, onChange: checkPassword })} />
                  {errors?.userConfirmPassword?.type === "password mismatch" && <span className='errorMessage'>{errors.userConfirmPassword.message}</span>}
                  {errors?.userConfirmPassword?.type === "required" && <span className='errorMessage'>This field is required</span>}
                </div>
              </>
            ) : null}

            <div className='login_form_page_buttons d-flex align-items-center mt-3'>
              <button type="submit" className='btn btn-primary' >Submit</button>
              <a href='#' onClick={accountCheck} className='ms-3'>{accountRegistered ? "Don't have an account ? Sign Up here" : "Already have an account ? login here"}</a>
            </div>
          </form>
        </div>
      </section>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Zoom}
      />
    </>
  )
}

export default Login
