import React, { useEffect, useState } from 'react';
import { auth, db } from "../firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase from "firebase";


function OnlineUsers(props) {
    const messagesRef = db.collection('users');
    const query = messagesRef.orderBy('createdAt').limit(50);
    const [users] = useCollectionData(query, {idField: 'id'});

    const {uid, displayName} = auth.currentUser;

    const [docIsUpdatedOnce, setDocIsUpdatedOnce] = useState(false);

    // When page first renders
    useEffect(()=>{
        if ( !docIsUpdatedOnce ) {
            console.log('mounted');
            const updateDoc = updateOrAddUser()

            return ()=>console.log('unmounting...');
        }
    }, []);

    useEffect(()=>{
        if ( docIsUpdatedOnce ) {
            console.log('doc is updated at least once')
            const interval = setInterval(()=>{
                db.collection("users").get().then((querySnapshot)=>{
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

        db.collection("users").get().then((querySnapshot)=>{
            querySnapshot.forEach((doc)=>{
                if ( doc.data().uid === uid && doc.data().name === displayName ) {
                    updateUserDocument(doc);
                }
            });
            setDocIsUpdatedOnce(()=>true);
        });

        const docRef = db.collection("users").doc(uid);

        docRef.get().then((doc)=>{
            if ( !doc.exists ) {
                addNewUserDocument();
                console.log("No such document! Creating one");            }
        }).catch((error)=>{
            console.log("Error getting document:", error);
        });
    }

    return (
        <section className="chat__users">
            <h2>People that are online</h2>
            <p>Current user name</p>
            { users && users.map((user)=>{
                if ( user.name !== displayName ) {
                    return <User key={ user.id } user={ user }/>
                } else {
                    return <></>
                }

            }) }
        </section>
    );
}

function User(props) {
    const user = props.user;

    const currentTimestamp = new Date() / 1000;
    const userLastSeen = getUsersLastVisit(user);

    const fiveMinutesAgo = 60 * 5;

    if ( userLastSeen >= (currentTimestamp - fiveMinutesAgo) ) {
        return (
            <p>{ user.name }</p>
        )
    } else {
        return <></>
    }

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
    const updateDoc = db.collection("users").doc(doc.id);
    updateDoc.update({
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

function getUsersLastVisit(user) {
    if ( user.lastSeen ) {
        const userLastSeenString = user.lastSeen.seconds + '.' + user.lastSeen.nanoseconds;
        return Number(userLastSeenString);
    }

}


export default OnlineUsers;