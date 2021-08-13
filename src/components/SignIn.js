import React from "react";

import firebase from "firebase";
import { auth } from "../firebase";

function SignInSection() {

    return (
        <>
            <header>
                <h1>Super Chat</h1>
            </header>
            <section className="signInSection">
                <p>Please sign in</p>
                <button onClick={ signInWithGoogle }>Sign in</button>
            </section>
        </>
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

export default SignInSection;