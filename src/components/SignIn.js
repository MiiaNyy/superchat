import React from "react";

import firebase from "firebase";
import { auth } from "../firebase";

import { SignInSection } from "./styledComponents/GeneralStyles";

function SignIn() {

    return (
        <SignInSection>
            <header>
                <h1>Welcome to Super Chat</h1>
            </header>
            <section>
                <p>So that you can start chatting with other users please sign in:</p>
                <div onClick={ signInWithGoogle } className="google-btn">
                    <div className="google-icon-wrapper">
                        <img className="google-icon" alt="google logo"
                             src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
                    </div>
                    <p className="btn-text"><b>Sign in with google</b></p>
                </div>
            </section>
        </SignInSection>
    )
}


function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    if ( isMobileDevice() ) {
        auth.signInWithRedirect(provider).then(()=> {
            console.log('Redirecting to google authentication successful')
        }).catch((error)=>{
            console.log("Error redirecting:", error);
        });
    } else {
        auth.signInWithPopup(provider).then(()=> {
            console.log('Opening pop-up to google authentication successful')
        }).catch((error)=>{
            console.log("Error getting pop up:", error);
        });
    }
}

function isMobileDevice() {
    if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        return true
    }
}

export default SignIn;