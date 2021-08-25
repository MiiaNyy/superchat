import React, { useEffect, useState } from 'react';
import { auth, db } from "../../firebase";
import firebase from "firebase";

import spinner from "../../assets/spinner.svg";
import { UserColor } from "../styledComponents/GeneralStyles";
import User from "./User";

import getUserIconImg from "../../helpers/getUserIconImg";
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
        // This return all users (except current user) that has been seen on the server in last minute
        const onlineUsersFromDB = getAllOnlineUsers(usersData);
        // compare arr from onlineUsersFromDB and current onlineUsers list
        // if there is differences merge onlineUsersFromDB to current onlineUsers list
        // otherwise do nothing
        const listsAreEqual = isEqual(onlineUsersFromDB, onlineUsers);

        if ( !listsAreEqual ) {
            console.log('lists are not equal, updating users list to:', onlineUsersFromDB);
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
        console.log('mounted');

        db.collection('users').doc(uid).get()
            .then((doc)=>{
                if ( doc.exists ) {
                    setCurrentUser(doc.data());
                    setLoadingComplete(true);
                } else {
                    addNewUserDocument(setLoadingComplete);
                    console.log("No such document! Creating one");
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
                <div className="flex online__user">
                    <UserColor color={ currentUser.themeColor }/>
                    <img width={ 30 } height={ 30 } src={ getUserIconImg(currentUser.chatIcon) } alt="users icon"/>
                    <p>You</p>
                </div>
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

function isEqual(value, other) {
    // Get the value type
    let type = Object.prototype.toString.call(value);

    // If the two objects are not the same type, return false
    if ( type !== Object.prototype.toString.call(other) ) return false;

    // If items are not an object or array, return false
    if ( ['[object Array]', '[object Object]'].indexOf(type) < 0 ) return false;

    // Compare the length of the length of the two items
    let valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    let otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    if ( valueLen !== otherLen ) return false;

    // Compare two items
    function compare(item1, item2) {

        // Get the object type
        let itemType = Object.prototype.toString.call(item1);

        // If an object or array, compare recursively
        if ( ['[object Array]', '[object Object]'].indexOf(itemType) >= 0 ) {
            if ( !isEqual(item1, item2) ) return false;
        }

        // Otherwise, do a simple comparison
        else {
            // If the two items are not the same type, return false
            if ( itemType !== Object.prototype.toString.call(item2) ) return false;

            // Else if it's a function, convert to a string and compare
            // Otherwise, just compare
            if ( itemType === '[object Function]' ) {
                if ( item1.toString() !== item2.toString() ) return false;
            } else {
                if ( item1 !== item2 ) return false;
            }

        }
    }

    // Compare properties
    if ( type === '[object Array]' ) {
        for (let i = 0; i < valueLen; i++) {
            if ( compare(value[i], other[i]) === false ) return false;
        }
    } else {
        for (let key in value) {
            if ( value.hasOwnProperty(key) ) {
                if ( compare(value[key], other[key]) === false ) return false;
            }
        }
    }

    // If nothing failed, return true
    return true;
}

export default OnlineUsersList;
















