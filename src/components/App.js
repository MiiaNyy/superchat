import React, { useState } from 'react';

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from '../firebase'

import ChatRoom from "./chat_room/ChatRoom";
import UserSettingsForm from "./user_settings/UserSettingsForm";
import LoadingSpinner from "./loadingSpinner";
import SignIn from "./SignIn";

import { Main } from "./styled_components/GeneralStyles";

function App () {
    const [currentUserData, setCurrentUserData] = useState();
    const [userSettingsSet, setUserSettingsSet] = useState(false);
    const [loadingComplete, setLoadingComplete] = useState(false);
    const [firstLogin, setFirstLogin] = useState(false);
    
    const [user, loading] = useAuthState(auth); // true if firebase.User is logged in, false if not
    /*
     useEffect(()=>{
     const timestamp = firebase.firestore.Timestamp.now();
     let fourDaysAgo = timestamp.seconds - (96 * 60 * 60); // timestamp for four days ago
     
     // Deletes all messages from firestore messages database which are MORE than four days old
     db.collection("messages").where("createdAt", "<", fourDaysAgo)
     .get().then((querySnapshot)=>{
     querySnapshot.forEach(element=>{
     element.ref.delete().then(()=>console.log('element successfully deleted'));
     });
     })
     }, [])*/
    
    // When user signs out from chat, return states to they default states
    function returnToDefaultStates () {
        auth.signOut().then(() => console.log('user has signed off'));
        setUserSettingsSet(false);
        setLoadingComplete(false);
        setFirstLogin(false);
    }
    
    function ChatRoomOrSettings () {
        // default state, user is signed in but loading is not complete. This should run first when page is loaded
        if ( !firstLogin && !loadingComplete && !userSettingsSet ) {
            getUserData().then(() => {
                console.log('default state')
                return <LoadingSpinner/>
            })
        }
        // First login, open first user settings form so user can select color and icon and then opens chatroom
        if ( firstLogin ) {
            if ( !loadingComplete && userSettingsSet ) {
                return <LoadingSpinner/>
            }
            if ( loadingComplete && userSettingsSet ) {
                console.log('second state')
                return <ChatRoom logOff={ returnToDefaultStates } userData={ currentUserData }/>
            }
            return <UserSettingsForm updatingSettings={ false } setUserData={ setCurrentUserData }
                                     userSettingsSet={ setUserSettingsSet } moveToChatRoom={ setLoadingComplete }/>
        }
        // if NOT first login, go straight to chat room
        if ( loadingComplete && userSettingsSet ) {
            return <ChatRoom logOff={ returnToDefaultStates } userData={ currentUserData }/>
        } else {
            return <LoadingSpinner/>
        }
    }
    
    async function getUserData () {
        const {uid} = auth.currentUser;
        try {
            const userDoc = await db.collection("users").doc(uid).get();
            if ( userDoc.exists ) {
                console.log('user doc exists', userDoc.data())
                setCurrentUserData(() => userDoc.data());
                setUserSettingsSet(true);
                setLoadingComplete(true);
            } else { // Users first login
                setFirstLogin(true);
            }
        } catch (e) {
            console.log('Error when getting user document first time', e);
        }
    }
    
    if ( loading ) {
        return (
            <Main grid={ true }>
                { <LoadingSpinner/> }
            </Main>
        )
    } else {
        return (
            <Main grid={ user }>
                { user ? <ChatRoomOrSettings/> : <SignIn/> }
            </Main>
        )
    }
}


export default App;
