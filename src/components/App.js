import React, { useState } from 'react';

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from '../firebase'

import ChatRoom from "./ChatRoom";
import SignInSection from "./SignIn";
import UserSettingsPopUp from "./UserSettingsPopUp";

function App() {
    const [user, loading] = useAuthState(auth); // true if firebase.User is logged in, false if not
    const [userSettingsOpen, setUserSettingsOpen] = useState(true);

    return (
        <>
            <main>
                { loading ? <p>LOADING</p> : user && !userSettingsOpen ? <ChatRoom/> : user && userSettingsOpen ? <UserSettingsPopUp setUserSettingsOpen={setUserSettingsOpen}/> : <SignInSection/> }
            </main>
        </>
    );
}


export default App;