import React, { useState } from 'react';

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from '../firebase'

import ChatRoom from "./ChatRoom";
import SignInSection from "./SignIn";
import UserSettingsForm from "./UserSettingsForm";

function App() {
    const [user, loading] = useAuthState(auth); // true if firebase.User is logged in, false if not

    const [userData, setUserData] = useState();

    const [userSettingsSet, setUserSettingsSet] = useState(false);
    const [loadingComplete, setLoadingComplete] = useState(false);

    const [firstLogin, setFirstLogin] = useState(false);


    function ChatRoomOrSettings() {

        // default state. This should run first and only once
        if ( !firstLogin && !loadingComplete && !userSettingsSet ) {
            console.log('Getting user data...')
            getUserData();
            return <p>loading</p>
        } else if ( firstLogin && !loadingComplete && !userSettingsSet ) {
            return <UserSettingsForm updatingSettings={ false } setUserData={ setUserData }
                                     userSettingsSet={ setUserSettingsSet }/>
        } else if ( loadingComplete && userSettingsSet ) {
            console.log('chatroom')
            return <ChatRoom userData={ userData }/>
        } else {
            return <p>loading</p>
        }
    }

    function getUserData() {
        const {uid} = auth.currentUser;

        db.collection("users").doc(uid).get()
            .then((doc)=>{
                if ( doc.exists ) {
                    // Not first login
                    setUserData(()=>doc.data());
                    setUserSettingsSet(true);
                } else {
                    // Users first login
                    setFirstLogin(true);
                }
                setLoadingComplete(true);
            })
            .catch((error)=>console.log('Error when getting user document first time', error));
    }

    return (
        <>
            <main>
                { loading ? <p>LOADING</p> : user ? <ChatRoomOrSettings/> : <SignInSection/> }
            </main>
        </>
    );
}


export default App;