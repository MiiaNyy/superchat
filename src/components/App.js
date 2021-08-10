import React, { useRef } from 'react';

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from '../firebase'

import ChatRoom from "./ChatRoom";
import SignInSection from "./SignIn";

function App() {
    const [user, loading] = useAuthState(auth); // true if firebase.User is logged in, false if not

    return (
        <>
            <main>
                { loading ? <p>LOADING</p> : user ? <ChatRoom/> : <SignInSection/> }
            </main>
        </>
    );
}


export default App;