import React, { useEffect, useState } from 'react';
import { auth, db } from "../../firebase";
import firebase from "firebase/app";

import spinner from "../../assets/spinner.svg";
import User from "./User";
import objectsAreEqual from "../../helpers/objectsAreEqual";
import uniqid from "uniqid";

import getUsersLastVisit from "../../helpers/getUsersLastVisit";

function OnlineUsersList () {
    const [usersData, setUsersData] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    
    const [currentUser, setCurrentUser] = useState();
    const [loadingComplete, setLoadingComplete] = useState(false);
    
    const {uid} = auth.currentUser;
    
    // First get the data from users database and save it to usersData
    useEffect(() => {
        try {
            db.collection('users').orderBy('createdAt').limit(100)
              .onSnapshot((snapshot) => {
                  setUsersData(snapshot.docs.map(doc => doc.data()));
              })
        } catch (e) {
            console.log('error happened when fetching all user data', e);
        }
    }, []);
    
    useEffect(() => {
        // This returns all users (except current user) that has been seen on the server in last minute
        const onlineUsersFromDB = getAllOnlineUsers(usersData);
        // compare arr from onlineUsersFromDB and current onlineUsers list if there is differences merge
        // onlineUsersFromDB to current onlineUsers list otherwise do nothing
        const listsAreEqual = objectsAreEqual(onlineUsersFromDB, onlineUsers);
        
        if ( !listsAreEqual ) {
            setOnlineUsers(() => onlineUsersFromDB);
        }
    }, [usersData])
    
   
    
    useEffect(() => {
        async function fetchData() {
            try {
                const currentUserDoc = await db.collection('users').doc(uid).get();
                if ( currentUserDoc.exists ) {
                    setCurrentUser(currentUserDoc.data());
                    setLoadingComplete(true);
                } else {
                    await addNewUserDocument(setLoadingComplete);
                }
            } catch (e) {
                console.log('error happened when fetching current user document from db', e);
            }
        }
        fetchData().then(r => console.log('data fetched'))
        return () => console.log('unmounting...');
    }, []);
    
    
    if ( loadingComplete ) {
        return (
            <div className="users__list">
                <h2>Chat users </h2>
                <User key={ uniqid() } user={ currentUser } currentUser={ true }/>
                { onlineUsers.map((user) => {
                    return <User key={ uniqid() } user={ user }/>;
                }) }
                <UpdateCurrentUser/>
            </div>
        );
    } else {
        return (
            <div className="users__list">
                <h2>Chat users </h2>
                <img width={ 50 } height={ 50 } style={ {margin: '2em auto'} } src={ spinner } alt="loading spinner"/>
            </div>
        )
    }
}

function UpdateCurrentUser () {
    const [timer, setTimer] = useState(0);
    const {uid} = auth.currentUser;
    
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prev => prev + 1)
        }, 100000);
        return () => clearInterval(interval);
    }, []);
    
    // Update user document every 1min, so other users can see if you are online or not
    useEffect( () => {
        async function updateUserDocument(){
            try {
                await db.collection("users").doc(uid).update({
                    lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
                })
            } catch (e) {
                console.error("Error updating document: ", e); // The document probably doesn't exist.
            }
        }
        updateUserDocument().then(r => console.log(''))
        
    }, [timer]);
    
    return <></>
}

function checkIfUserIsOnline (user) {
    const currentTimestamp = new Date() / 1000;
    const userLastSeen = getUsersLastVisit(user);
    
    // is online if they have been seen in last 3min on server
    return userLastSeen >= (currentTimestamp - 60)
}

function getAllOnlineUsers (allUsersData) {
    const {uid} = auth.currentUser;
    let onlineUsers = [];
    for (let i = 0; i < allUsersData.length; i++) { // loop all of the data from users database
        const userData = allUsersData[i]; // one user from database
        const userIsOnline = checkIfUserIsOnline(userData);
        
        if ( userIsOnline ) {
            if ( userData.uid !== uid ) { // if online user is NOT same as current user push it to the list
                onlineUsers.push({
                    themeColor: userData.themeColor,
                    chatIcon: userData.chatIcon,
                    chatName: userData.chatName,
                })
            }
        }
    }
    return onlineUsers;
}

async function addNewUserDocument (setLoadingComplete) {
    try {
        const {uid, displayName} = auth.currentUser;
        
        await db.collection("users").doc(uid).set({
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            name: displayName
        })
        setLoadingComplete(true);
        console.log("Document successfully added to collection!");
    } catch (e) {
        console.error("Error when adding new user document: ", e);
    }
}


export default OnlineUsersList;
















