import React, { useState } from "react";
import { auth, db } from "../../firebase";
import firebase from "firebase";
import SendImageMsg from "./SendImageMsg";

function NewMessageForm({currentUser}) {
    const [formValue, setFormValue] = useState('');

    // writes new document to firestore
    function sendMessage(e) {
        e.preventDefault();
        const {uid, photoURL} = auth.currentUser;

        // create new document with these values
        db.collection('messages').add({
            senderName: currentUser.chatName,
            senderIcon: currentUser.chatIcon,
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL,
            color: currentUser.themeColor
        }).then(r=>{
            console.log('New message successfully added to database')
        }).catch(error=>console.log('error happened when adding new message:', error))
        setFormValue('');
    }

    return (
        <section className="form-flex">
            <SendImageMsg currentUser={ currentUser }/>
            <form className="msg-form" onSubmit={ (e)=>sendMessage(e) }>
                <input type="text" placeholder="Send message..." value={ formValue }
                       onChange={ (e)=>setFormValue(e.target.value) }/>
                <button type="submit"><i className="fas fa-share add-msg__icon"/></button>
            </form>
        </section>
    )
}

export default NewMessageForm;