import React, { useEffect, useState } from 'react';

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from '../firebase'

import ChatRoom from "./chatRoom/ChatRoom";
import UserSettingsForm from "./UserSettingsForm";
import LoadingSpinner from "./loadingSpinner";
import SignIn from "./SignIn";

import { Main } from "./styledComponents/GeneralStyles";
import firebase from "firebase";

function App() {
    const [currentUserData, setCurrentUserData] = useState();
    const [userSettingsSet, setUserSettingsSet] = useState(false);
    const [loadingComplete, setLoadingComplete] = useState(false);
    const [firstLogin, setFirstLogin] = useState(false);

    const [user, loading] = useAuthState(auth); // true if firebase.User is logged in, false if not

    useEffect(()=>{
        const timestamp = firebase.firestore.Timestamp.now();
        let fourDaysAgo = timestamp.seconds - (96 * 60 * 60); // timestamp for four days ago

        // Deletes all messages from firestore messages database which are MORE than four days old
        db.collection("messages").where("createdAt", "<", fourDaysAgo)
            .get().then((querySnapshot)=>{
            querySnapshot.forEach(element=>{
                element.ref.delete().then(r=>console.log('element successfully deleted'));
            });
        })
    }, [])

    // When user signs out from chat, return states to they default states
    function returnToDefaultStates() {
        auth.signOut().then(r=>console.log('user has signed off'));
        setUserSettingsSet(false);
        setLoadingComplete(false);
        setFirstLogin(false);
    }

    function ChatRoomOrSettings() {
        if ( !firstLogin && !loadingComplete && !userSettingsSet ) { // default state. This should run first and only once
            getUserData();
            return <LoadingSpinner/>
        }
        // If first login, open first user settings form and then chatroom
        if ( firstLogin ) {
            if ( !loadingComplete && userSettingsSet ) {
                return <LoadingSpinner/>
            }
            if ( loadingComplete && userSettingsSet ) {
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

    function getUserData() {
        const {uid} = auth.currentUser;

        db.collection("users").doc(uid).get()
            .then((doc)=>{
                if ( doc.exists ) {
                    setCurrentUserData(()=>doc.data());
                    setUserSettingsSet(true);
                    setLoadingComplete(true);
                } else { // Users first login
                    setFirstLogin(true);
                }
            })
            .catch((error)=>console.log('Error when getting user document first time', error));
    }

//
    return (
        <Main>
            { loading ? <LoadingSpinner/> : user ? <ChatRoomOrSettings/> : <SignIn/> }
        </Main>
    )
}


export default App;