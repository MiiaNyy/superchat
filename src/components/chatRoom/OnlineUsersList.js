import React, { useEffect, useState } from 'react';
import { auth, db } from "../../firebase";
import firebase from "firebase";

import spinner from "../../assets/spinner.svg";
import User from "./User";
import objectsAreEqual from "../../helpers/objectsAreEqual";
import uniqid from "uniqid";

import getUsersLastVisit from "../../helpers/getUsersLastVisit";

function OnlineUsersList() {
    const [usersData, setUsersData] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);

    const [currentUser, setCurrentUser] = useState();
    const [loadingComplete, setLoadingComplete] = useState(false);
    const [timer, setTimer] = useState(0);

    const {uid} = auth.currentUser;

    // First get the data from users database and save it to usersData
    useEffect(()=>{
        db.collection('users').orderBy('createdAt').limit(100)
            .onSnapshot((snapshot)=>{
                setUsersData(snapshot.docs.map(doc=>doc.data()));
            })
    }, []);

    useEffect(()=>{
        // This returns all users (except current user) that has been seen on the server in last minute
        const onlineUsersFromDB = getAllOnlineUsers(usersData);
        // compare arr from onlineUsersFromDB and current onlineUsers list if there is differences merge 
        // onlineUsersFromDB to current onlineUsers list otherwise do nothing
        const listsAreEqual = objectsAreEqual(onlineUsersFromDB, onlineUsers);

        if ( !listsAreEqual ) {
            setOnlineUsers(()=>onlineUsersFromDB);
        }
    }, [usersData])

    useEffect(()=>{
        const interval = setInterval(()=>{
            setTimer(prev=>prev + 1)
        }, 20000);
        return ()=>clearInterval(interval);
    }, []);

    useEffect(()=>{
        db.collection('users').doc(uid).get()
            .then((doc)=>{
                if ( doc.exists ) {
                    setCurrentUser(doc.data());
                    setLoadingComplete(true);
                } else {
                    addNewUserDocument(setLoadingComplete);
                }
            }).catch((error)=>{
            console.log("Error getting document:", error);
        });
        return ()=>console.log('unmounting...');
    }, []);

    // Update user document every 20s, so other users can see if you are online or not
    useEffect(()=>{
        db.collection("users").doc(uid).update({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        })
            .then(()=>console.log("Document successfully updated!"))
            .catch((error)=>console.error("Error updating document: ", error)); // The document probably doesn't exist.
    }, [timer]);


    if ( loadingComplete ) {
        return (
            <div className="users__list">
                <h2>Chat users </h2>
                <User key={ uniqid() } user={ currentUser } currentUser={true}/>
                { onlineUsers.map((user)=>{
                    return <User key={ uniqid() } user={ user }/>;
                }) }
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

function checkIfUserIsOnline(user) {
    const currentTimestamp = new Date() / 1000;
    const userLastSeen = getUsersLastVisit(user);

    // is online if they have been seen in last 3min on server
    return userLastSeen >= (currentTimestamp - 60)
}

function getAllOnlineUsers(allUsersData) {
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

function addNewUserDocument(setLoadingComplete) {
    const {uid, displayName} = auth.currentUser;

    db.collection("users").doc(uid).set({
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        name: displayName
    })
        .then(()=>{
            setLoadingComplete(true);
            console.log("Document successfully added to collection!");
        })
        .catch((error)=>{
            console.error("Error when adding document: ", error);
        });
}


export default OnlineUsersList;
















