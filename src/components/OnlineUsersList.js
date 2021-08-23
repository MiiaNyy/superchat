import React, { useEffect, useState } from 'react';
import { auth, db } from "../firebase";
import firebase from "firebase";

import spinner from "../spinner.svg";
import { UserColor } from "./styledComponents/Styles";
import User from "./User";

import getUserIconImg from "../helpers/getUserIconImg";

function OnlineUsersList() {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUSer] = useState();
    const [loadingComplete, setLoadingComplete] = useState(false);

    const {uid} = auth.currentUser;

    const [timer, setTimer] = useState(0);

    useEffect(()=>{
        db.collection('users').orderBy('createdAt').limit(100)
            .onSnapshot((snapshot)=>{
                setUsers(snapshot.docs.map(doc=>doc.data()))
            })
    }, []);

    useEffect(()=>{
        const interval = setInterval(()=>{
            setTimer(prev=>prev + 1)
        }, 10000);
        return ()=>clearInterval(interval);
    }, []);

    useEffect(()=>{
        console.log('mounted');

        db.collection('users').doc(uid).get()
            .then((doc)=>{
                if ( doc.exists ) {
                    setCurrentUSer(doc.data());
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

    // Update user document every 10s, so other users can see if you are online or not
    useEffect(()=>{
        db.collection("users").doc(uid).update({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        })
            .then(()=>console.log("Document successfully updated!"))
            .catch((error)=>console.error("Error updating document: ", error)); // The document probably doesn't exist.
    }, [timer])


    if ( loadingComplete ) {
        return (
            <div className="users__list">
                <h2>Chat users </h2>
                <div className="flex online__user">
                    <UserColor color={ currentUser.themeColor }/>
                    <img width={ 30 } height={ 30 } src={ getUserIconImg(currentUser.chatIcon) } alt="users icon"/>
                    <p>You</p>
                </div>
                { users.map((user)=>{
                    return <User key={ user.id } user={ user }/>;
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