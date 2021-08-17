import React, { useEffect, useState } from 'react';
import { auth, db } from "../firebase";
import firebase from "firebase";

import User from "./User";

function OnlineUsers() {
    const [users, setUsers] = useState([]);
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
                    console.log('not a new user');
                } else {
                    addNewUserDocument();
                    console.log("No such document! Creating one");
                }
            }).catch((error)=>{
            console.log("Error getting document:", error);
        });
        return ()=>console.log('unmounting...');

    }, []);

    useEffect(()=>{
        db.collection("users").doc(uid).update({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        })
            .then(()=>console.log("Document successfully updated!"))
            .catch((error)=>console.error("Error updating document: ", error)); // The document probably doesn't exist.
    },[timer])

    return (
        <section className="chat__users">
            <h2>People that are online</h2>
            { users.map((user)=>{
                return user.uid === uid ? <p>You</p> : <User key={ user.id } user={ user }/>;
            }) }
        </section>
    );
}

function addNewUserDocument() {
    const {uid, displayName} = auth.currentUser;

    db.collection("users").doc(uid).set({
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        name: displayName
    })
        .then(()=>{
            console.log("Document successfully added to collection!");
        })
        .catch((error)=>{
            console.error("Error when adding document: ", error);
        });
}



export default OnlineUsers;