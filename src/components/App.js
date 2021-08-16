import React, { useState } from 'react';

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from '../firebase'

import ChatRoom from "./ChatRoom";
import SignInSection from "./SignIn";
import UserSettingsForm from "./UserSettingsForm";

function App() {
    const [user, loading] = useAuthState(auth); // true if firebase.User is logged in, false if not

    const [userData, setUserData] = useState();

    const [usersFirstLogin, setUsersFirstLogin] = useState(false);
    const [userSettingsSet, setUserSettingsSet] = useState(false);

    const [loadingComplete, setLoadingComplete] = useState(false);


    function ChatRoomOrSettings() {
        console.log('user is signed in');


        if ( loadingComplete && userSettingsSet ) {
            console.log('chatroom')
            return <ChatRoom/>
        } else {
            console.log('users first login');
            return <UserSettingsForm setUserData={setUserData} userSettingsSet={ setUserSettingsSet }/>
        }
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