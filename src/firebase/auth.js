import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, sendPasswordResetEmail, updatePassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { auth } from "./firebase";

export const doCreateUserWithEmailAndPassword = async (email, password)=>{
    return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInUserWithEmailAndPassword = async (email, password)=>{
    return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async ()=>{
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider)
    // result.user
    return result
};

export const doSignOut = () => {
    return auth.signOut();
}

// export const doPasswordReset = (email)=>{
//     return sendPasswordResetEmail(auth, email);
// }

// export const doPasswordChange = (password)=>{
//     return updatePassword(auth.currentUser,password)
// }

export const doSendEmailVerification = (userFullName) =>{
    return sendEmailVerification(auth.currentUser, {
        url:`${window.location.origin}/login/${userFullName}`
    });
};

export const doUpdateProfile = (userFullName) =>{
    return updateProfile(auth.currentUser,{
        displayName:userFullName
    })
} 