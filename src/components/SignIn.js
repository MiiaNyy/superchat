import React from "react";

import firebase from "firebase";
import { auth } from "../firebase";

function SignInSection() {

    return (
        <section className="signInSection">
            <p>Please sign in</p>
            <button onClick={ signInWithGoogle }>Sign in</button>
        </section>
    )
}


function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    if ( isMobileDevice() ) {
        auth.signInWithRedirect(provider);
    } else {
        auth.signInWithPopup(provider);
    }
}

function isMobileDevice() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true
    }
}

export default SignInSection;