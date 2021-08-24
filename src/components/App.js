import React, { useEffect, useState } from 'react';

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from '../firebase'

import ChatRoom from "./chatRoom/ChatRoom";
import UserSettingsForm from "./UserSettingsForm";

import spinner from "../assets/spinner.svg";
import SignIn from "./SignIn";
import { Main } from "./styledComponents/GeneralStyles";
import firebase from "firebase";

function App() {
    const [userData, setUserData] = useState();
    const [userSettingsSet, setUserSettingsSet] = useState(false);
    const [loadingComplete, setLoadingComplete] = useState(false);
    const [firstLogin, setFirstLogin] = useState(false);

    const [user, loading] = useAuthState(auth); // true if firebase.User is logged in, false if not
    const [gridOn, setGridOn] = useState(false); // main elements display grid. True on Chatroom, false anywhere else

    useEffect(()=>{

        // Removes all messages from firestore messages database which are MORE than four days old
        const timestamp = firebase.firestore.Timestamp.now();
        let fourDaysAgo = timestamp.seconds - (96 * 60 * 60); // timestamp for four days ago

        db.collection("messages").where("createdAt", ">", fourDaysAgo)
            .get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                console.log(doc.id, " => ", doc.data());
            });
        })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });

        db.collection("messages").where("createdAt", "<", fourDaysAgo)
            .get().then(function (querySnapshot) {
            querySnapshot.forEach(element=>{
                element.ref.delete().then(r=>console.log('element successfully deleted'));
            });
        })
    }, [])

    function returnToDefaultStates() {
        auth.signOut().then(r=>console.log('user has signed off'));
        setUserSettingsSet(false);
        setLoadingComplete(false);
        setGridOn(false);
    }

    function ChatRoomOrSettings() {
        if ( !firstLogin && !loadingComplete && !userSettingsSet ) { // default state. This should run first and only once
            getUserData();
            return <LoadingSpinner/>
        } else if ( firstLogin && !loadingComplete && !userSettingsSet ) {
            return <UserSettingsForm updatingSettings={ false } setUserData={ setUserData }
                                     userSettingsSet={ setUserSettingsSet }/>
        } else if ( loadingComplete && userSettingsSet ) {
            setGridOn(true);
            return <ChatRoom logOff={ returnToDefaultStates } userData={ userData }/>
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
        <Main grid={ gridOn }>
            { loading ? <LoadingSpinner/> : user ? <ChatRoomOrSettings/> : <SignIn/> }
        </Main>
    )
}

function LoadingSpinner() {
    return <img width={ 90 } height={ 90 } style={ {margin: "2em auto", gridArea: "1/2/2/2"} } src={ spinner }
                alt="loading"/>
}


export default App;