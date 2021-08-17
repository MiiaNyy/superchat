import { auth, db } from "../firebase";
import React, { useEffect, useRef, useState } from "react";
import firebase from "firebase";

import SendImageMsg from "./SendImageMsg";
import OnlineUsers from "./OnlineUsers";
import UserSettingsForm from "./UserSettingsForm";

import uniqid from "uniqid";

function ChatRoom({userData}) {
    const [currentUser, setCurrentUser] = useState(userData);
    const [userSettingsOpen, setUserSettingsOpen] = useState(false);
    const [formValue, setFormValue] = useState('');

    const scrollDownRef = useRef();

    const [messages, setMessages] = useState([]);


    useEffect(()=>{
        db.collection('messages').orderBy('createdAt').limit(100)
            .onSnapshot((snapshot)=>{
                setMessages(snapshot.docs.map(doc=>doc.data()))
            })
    }, [])


    useEffect(()=>{
        scrollDownRef.current.scrollIntoView({behavior: 'smooth'});
    }, [messages])

// writes new document to firestore
    async function sendMessage(e) {
        e.preventDefault();
        const {uid, photoURL} = auth.currentUser;

        // create new document with these values
        await db.collection('messages').add({
            senderName: currentUser.chatName,
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL
        });
        setFormValue('');
        scrollDownRef.current.scrollIntoView({behavior: 'smooth'});
    }

    return (
        <>
            <header className="chat__header">
                <h2>Hello { currentUser.chatName }!</h2>
                <button onClick={ ()=>auth.signOut() }>Sign out</button>
                <button onClick={ ()=>setUserSettingsOpen(true) }>Settings</button>
            </header>

            <OnlineUsers/>

            <section className="chat__messages">
                { messages.map((msg, index)=>{
                    return <ChatMessage key={ uniqid() } message={ msg }/>
                }) }
                <div id="scrollDown" ref={ scrollDownRef }/>
            </section>

            <section className="form-flex">
                <SendImageMsg/>
                <form className="msg-form" onSubmit={ (e)=>sendMessage(e) }>
                    <input type="text" placeholder="Send message..." value={ formValue }
                           onChange={ (e)=>setFormValue(e.target.value) }/>
                    <button type="submit"><i className="far fa-paper-plane add-msg__icon"/></button>
                </form>
            </section>
            { userSettingsOpen ?
                <UserSettingsForm updatingSettings={ true } userData={ userData } setUserData={ setCurrentUser }
                                  userSettingsOpen={ setUserSettingsOpen }/> : <></> }
        </>
    )
}

function ChatMessage({message}) {
    const {text, uid, imageUrl, senderName} = message;
    // Give different styling depending if msg is sent by current user or received
    const messageClass = uid === auth.currentUser.uid ? 'msgSent' : 'msgReceived';

    return (
        <div className="message">
            <div className={ messageClass }>
                <span>{ senderName }</span>
                { imageUrl ? <img className="msgImg" src={ imageUrl } alt="sent image"/> : < p> { text }</p> }
            </div>
        </div>
    )
}

export default ChatRoom;