import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import React, { useEffect, useRef, useState } from "react";
import firebase from "firebase";
import SendImageMsg from "./SendImageMsg";
import OnlineUsers from "./OnlineUsers";

function ChatRoom(props) {
    const [formValue, setFormValue] = useState('');
    const scrollDownRef = useRef();

    const messagesRef = db.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(50);

    const [messages] = useCollectionData(query, {idField: 'id'});
    const [user] = useAuthState(auth);

    useEffect(()=>{
        document.getElementById('scrollDown').scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest"
        });
    });

// writes new document to firestore
    async function sendMessage(e) {
        e.preventDefault();
        const {uid, photoURL} = auth.currentUser;

        // create new document with these values
        await messagesRef.add({
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
                <h2>Hello { user.displayName }!</h2>
                <button onClick={ ()=>auth.signOut() }>Sign out</button>
            </header>

            <OnlineUsers/>


            <section className="chat__messages">
                { messages && messages.map(msg=><ChatMessage key={ msg.id } message={ msg }/>) }
                <div id="scrollDown" ref={ scrollDownRef }/>
            </section>

            <section className="form-flex">
                <SendImageMsg/>
                <form className="msg-form" onSubmit={ (e)=>sendMessage(e, messagesRef) }>
                    <input type="text" placeholder="Send message..." value={ formValue }
                           onChange={ (e)=>setFormValue(e.target.value) }/>
                    <button type="submit"><i className="far fa-paper-plane add-msg__icon"/></button>
                </form>

            </section>


        </>
    )
}


function ChatMessage(props) {
    const {text, uid, photoURL, imageUrl} = props.message;
    // Give different styling depending if msg is sent by current user or received
    const messageClass = uid === auth.currentUser.uid ? 'msgSent' : 'msgReceived';

    return (
        <div className="message">
            <div className={ messageClass }>
                { imageUrl ? <img className="msgImg" src={ imageUrl } alt="sent image"/> : < p> { text }</p> }
            </div>
        </div>
    )
}


export default ChatRoom;