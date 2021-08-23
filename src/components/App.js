import React, { useState } from 'react';

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from '../firebase'

import ChatRoom from "./ChatRoom";
import UserSettingsForm from "./UserSettingsForm";

import spinner from "../spinner.svg";
import SignInSection from "./SignIn";

function App() {
    const [userData, setUserData] = useState();
    const [userSettingsSet, setUserSettingsSet] = useState(false);
    const [loadingComplete, setLoadingComplete] = useState(false);
    const [firstLogin, setFirstLogin] = useState(false);

    const [user, loading] = useAuthState(auth); // true if firebase.User is logged in, false if not

    const gridOn = loadingComplete && userSettingsSet ? 'grid' : '';

    function ChatRoomOrSettings() {
        if ( !firstLogin && !loadingComplete && !userSettingsSet ) { // default state. This should run first and only once
            getUserData();
            return <LoadingSpinner/>
        } else if ( firstLogin && !loadingComplete && !userSettingsSet ) {
            return <UserSettingsForm updatingSettings={ false } setUserData={ setUserData }
                                     userSettingsSet={ setUserSettingsSet }/>
        } else if ( loadingComplete && userSettingsSet ) {
            return <ChatRoom userData={ userData }/>
        } else {
            return <img width={ 90 } height={ 90 } style={ {margin: "2em auto"} } src={ spinner } alt="loading"/>
        }
    }

    function getUserData() {
        const {uid} = auth.currentUser;

        db.collection("users").doc(uid).get()
            .then((doc)=>{
                if ( doc.exists ) {
                    setUserData(()=>doc.data());
                    setUserSettingsSet(true);
                } else { // Users first login
                    setFirstLogin(true);
                }
                setLoadingComplete(true);
            })
            .catch((error)=>console.log('Error when getting user document first time', error));
    }

    return (
        <main className={gridOn}>
            { loading ? <LoadingSpinner/> : user ? <ChatRoomOrSettings/> : <SignInSection/> }
        </main>
    )
}

function LoadingSpinner() {
    return <img width={ 90 } height={ 90 } style={ {margin: "2em auto", gridArea: "1/2/2/2"} } src={ spinner }
                alt="loading"/>
}


export default App;