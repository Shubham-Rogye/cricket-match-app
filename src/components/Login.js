import React, { useEffect, useState } from 'react'
import NavbarComp from './Navbar'
import { useForm } from "react-hook-form"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Zoom, ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux'
import { loginPageFalse, loginPageTrue } from '../features/ValidityChecks/loginPageCheckSlice'
import googleIcon from '../G_icon.png'
import { doCreateUserWithEmailAndPassword, doSendEmailVerification, doSignInUserWithEmailAndPassword, doSignInWithGoogle, doUpdateProfile } from '../firebase/auth'
import { setUserToken } from '../features/UserToken/userTokenSlice'
import { setUserData } from '../features/UserData/userDataSlice'
import { setLoader } from '../features/Loader/loaderSlice'
import { db } from '../firebase/firebase'
import { addDoc, collection, doc, setDoc, getDoc } from 'firebase/firestore'


const Login = () => {
  const loginPageCheck = useSelector((state)=>state.loginPage.value);
  const dispatch = useDispatch();
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
  } = useForm()

  const [registerUser, setRegisterUser] = useState({
    userFullName: "",
    userDOB: "",
    userEmail: "",
    userPassword: ""

  })
  const [accountRegistered, setAccountRegistered] = useState(true)
  const [passwordMatchCheck, setPasswordMatchCheck] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [getData, setGetData] = useState([])

  dispatch(loginPageTrue())

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
      clearErrors("userConfirmPassword1")
    } else {
      setError("userConfirmPassword1", {
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
    axios.get(URL)
      .then((res) => {
        setGetData(res.data);
      })
      .catch((err) => console.log(err))
  }, [accountRegistered])

  const onSubmit = async (data) => {
        dispatch(setLoader(true));
        if(accountRegistered){
          doSignInUserWithEmailAndPassword(data.userEmail, data.userPassword)
          .then((res)=> {
            dispatch(setLoader(false));
            if(res._tokenResponse.registered){
              dispatch(loginPageFalse());
              dispatch(setUserData(res));
              dispatch(setUserToken(res.user.uid))
              navigate(`/welcome/${res.user.displayName != null ? res.user.displayName:res.user.email}`)
            }else{
              toast.error('Email is not registered, Please Sign up');
              reset();
            }
            
          })
          .catch((err)=>{
            dispatch(setLoader(false));
            toast.error('Email is not registered / Invalid password');
            reset();
          })         
        } else{
          doCreateUserWithEmailAndPassword(data.userEmail, data.userPassword)
          .then((res)=>{
            const docRef = doc(db, "users", res.user.uid);
            setDoc(docRef,{
              email:res.user.email
            }).then(()=>{
              dispatch(setLoader(false));
              doUpdateProfile(data.userFullName)
              toast.success('data has been successfully registered');
              reset(); setAccountRegistered(!accountRegistered);
            });          
          }
          )
          .catch((signUpError)=>{
            dispatch(setLoader(false));
            if(signUpError.code == 'auth/email-already-in-use'){
              toast.error('email-already-in-use');
            }
          })
        }
  };

  const onGoogleSignIn = (e) =>{
    setLoader(true);
    e.preventDefault();
    doSignInWithGoogle().then((res)=>(setLoader(false),dispatch(setUserData(res)),dispatch(setUserToken(res.user.uid)),navigate(`/welcome/${res.user.displayName}`))).catch((err)=>console.log(err))
  }

  return (
    <>
      <NavbarComp valid={loginPageCheck} />
      <div className='container'>
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
                onChange: () => {setPasswordMatchCheck(watch("userPassword")); setRegisterUser({...registerUser, userPassword:watch("userPassword")}); reset({userConfirmPassword: ""})} })} />
              {errors?.userPassword?.type === "required" && <span className='errorMessage'>This field is required</span>}
              {!accountRegistered && <>{errors?.userPassword?.type === "minLength" && <span className='errorMessage'>{errors.userPassword.message}</span>}{errors?.userPassword?.type === "pattern" && <span className='errorMessage'>Password must contain aleast 1 capital letter & 1 number</span>}</>}
            </div>
            {!accountRegistered ? (
              <>
                <div className='password_box'>
                <i className={showPass ? 'bi bi-eye-slash-fill':'bi bi-eye-fill'} onClick={()=>setShowPass(!showPass)}></i>
                  <label className='form-label'>Confirm password</label>
                  <input type={showPass ? 'text':'password'} className={errors.userConfirmPassword ? 'form-control error' : 'form-control'} {...register("userConfirmPassword", { required: true, onChange: checkPassword })} />
                  {errors?.userConfirmPassword?.type === "required" && <span className='errorMessage'>This field is required</span>}
                  {errors?.userConfirmPassword1?.type === "password mismatch" && <span className='errorMessage'>{errors.userConfirmPassword1.message}</span>}
                </div>
              </>
            ) : null}

            <div className='login_form_page_buttons d-flex align-items-center mt-3'>
              <button type="submit" className='btn btn-primary' >Submit</button>
              <a href='#' onClick={accountCheck} className='ms-3'>{accountRegistered ? "Don't have an account ? Sign Up here" : "Already have an account ? login here"}</a>
            </div>
            <div className='hr-line'>
              <hr />
              <span>OR</span>
            </div> 
            
          </form>
          <div className='social_signup_box'>
            <button className='btn btn-light d-flex w-100 justify-content-center' style={{gap:"10px"}} onClick={onGoogleSignIn}>
              <img src={googleIcon}/>
              <span>Signup with Google</span>
              </button>
            </div>
        </div>
      </section>
      </div>
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
