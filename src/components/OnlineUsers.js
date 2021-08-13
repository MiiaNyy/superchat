import React, { useEffect, useState } from 'react';
import { auth, db } from "../firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase from "firebase";

import User from "./User";

function OnlineUsers() {
    const usersRef = db.collection('users');
    const query = usersRef.orderBy('createdAt').limit(50);
    const [users] = useCollectionData(query, {idField: 'id'});
    const {uid, displayName} = auth.currentUser;

    const [docIsUpdatedOnce, setDocIsUpdatedOnce] = useState(false);

    // When page first renders
    useEffect(()=>{
        if ( !docIsUpdatedOnce ) {
            console.log('mounted');
            const updateOrAddDoc = updateOrAddUser()
            return ()=>console.log('unmounting...');
        }
    }, []);

    // updates current users lastSeen value, every 10s
    useEffect(()=>{
        if ( docIsUpdatedOnce ) {
            const interval = setInterval(()=>{
                usersRef.get().then((querySnapshot)=>{
                    querySnapshot.forEach((doc)=>{
                        if ( doc.data().uid === uid && doc.data().name === displayName ) {
                            updateUserDocument(doc);
                        }
                    });
                });
            }, 10000);
            return ()=>clearInterval(interval)
        }
    }, [docIsUpdatedOnce]);

    async function updateOrAddUser() {

        usersRef.get().then((querySnapshot)=>{
            querySnapshot.forEach((doc)=>{
                if ( doc.data().uid === uid && doc.data().name === displayName ) {
                    updateUserDocument(doc);
                }
            });
            setDocIsUpdatedOnce(()=>true);
        });

        usersRef.doc(uid).get().then((doc)=>{
            if ( !doc.exists ) {
                addNewUserDocument();
                console.log("No such document! Creating one");
            }
        }).catch((error)=>{
            console.log("Error getting document:", error);
        });
    }

    return (
        <section className="chat__users">
            <h2>People that are online</h2>
            <p>Current user name</p>
            { users && users.map((user)=>{
                return user.name !== displayName ? <User key={ user.id } user={ user }/> : <></>;
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

function updateUserDocument(doc) {
    db.collection("users").doc(doc.id).update({
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
    })
        .then(()=>{
            console.log("Document successfully updated!");
        })
        .catch((error)=>{
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
}


export default OnlineUsers;