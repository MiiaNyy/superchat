import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import React, { useEffect, useRef, useState } from "react";
import firebase from "firebase";

// A loading image URL.
const LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';

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

            <section className="chat__users">
                <h2>People that are online</h2>
                <p>Ben Stiller</p>
                <p>Ben Stiller</p>
                <p>Ben Stiller</p>
                <p>Ben Stiller</p>
                <p>Ben Stiller</p>
                <p>Ben Stiller</p>
            </section>


            <section className="chat__messages">
                { messages && messages.map(msg=><ChatMessage key={ msg.id } message={ msg }/>) }
                <div id="scrollDown" ref={ scrollDownRef }/>
            </section>

            <form className="chat__form" onSubmit={ (e)=>sendMessage(e, messagesRef) }>
                <input type="text" placeholder="Send message..." value={ formValue }
                       onChange={ (e)=>setFormValue(e.target.value) }/>
                <button type="submit"><i className="fas fa-chevron-right"/></button>

            </form>
            <form id="image-form" action="#">
                <label htmlFor="mediaCapture" className="add-image__label"><i
                    className="far fa-file-image add-image__icon"/></label>
                <input onChange={ (e)=>onMediaFileSelected(e) } id="mediaCapture" type="file" accept="image/*"
                       capture="camera" className="custom-file-input"/>
            </form>

        </>
    )
}

function onMediaFileSelected(e) {
    e.preventDefault();
    const file = e.target.files[0];
    console.log('file is', file);
    // Clear the selection in the file picker input.
    document.getElementById('image-form').reset();

    // Check if the file is an image.
    if ( !file.type.match('image.*') ) {
        const data = {
            message: 'You can only share images',
            timeout: 2000
        };
        return;
    }

    saveImageMessage(file);
}

// Saves a new message containing an image in Firebase.
// This first saves the image in Firebase storage.
function saveImageMessage(file) {
    const {uid, photoURL} = auth.currentUser;
    const messagesRef = db.collection('messages');
    // 1 - We add a message with a loading icon that will get updated with the shared image.
    messagesRef.add({
        uid,
        photoURL,
        imageUrl: LOADING_IMAGE_URL,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    }).then((messageRef)=>{
        console.log('messageref', messageRef.id)
        // 2 - Upload the image to Cloud Storage.
        const filePath = firebase.auth().currentUser.uid + '/' + messageRef.id + '/' + file.name;
        return firebase.storage().ref(filePath).put(file).then((fileSnapshot)=>{
            // 3 - Generate a public URL for the file.
            return fileSnapshot.ref.getDownloadURL().then((url)=>{
                // 4 - Update the chat message placeholder with the image's URL.
                console.log(url)
                return messageRef.update({
                    imageUrl: url,
                    storageUri: fileSnapshot.metadata.fullPath
                });
            });
        });
    }).catch(function (error) {
        console.error('There was an error uploading a file to Cloud Storage:', error);
    });
}

function getUsers() {

}

function ChatMessage(props) {
    const {text, uid, photoURL, imageUrl} = props.message;
    console.log(props.message);

    // Give different styling depending if msg is sent by current user or received
    const messageClass = uid === auth.currentUser.uid ? 'msgSent' : 'msgReceived';


    return (
        <div className="message">
            <div className={ messageClass }>
                {imageUrl ? <img className="msgImg" src={imageUrl} alt="sent image"/> : < p> { text }</p>}
            </div>
        </div>
    )
}


export default ChatRoom;