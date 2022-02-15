import React, { useState } from "react";
import { auth, db } from "../../firebase";
import firebase from "firebase";
import SendImageMsg from "./SendImageMsg";

function NewMessageForm ({currentUser}) {
    const [formValue, setFormValue] = useState('');
    
    // writes new message document to firestore db
    async function sendMessage (e) {
        e.preventDefault();
        const {uid} = auth.currentUser;
        try {
            await db.collection('messages').add({
                senderName: currentUser.chatName,
                senderIcon: currentUser.chatIcon,
                text: formValue,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                uid,
                color: currentUser.themeColor,
            })
            setFormValue('');
            console.log('New message successfully added to database')
        } catch (e) {
            console.log('error happened when adding new message:', e)
        }
    }
    
    return (
        <section className="form-flex">
            <SendImageMsg currentUser={ currentUser }/>
            <form className="msg-form" onSubmit={ (e) => sendMessage(e) }>
                <input type="text" placeholder="Send message..." value={ formValue }
                       onChange={ (e) => setFormValue(e.target.value) }/>
                <button type="submit"><i className="fas fa-share add-msg__icon"/></button>
            </form>
        </section>
    )
}

export default NewMessageForm;
