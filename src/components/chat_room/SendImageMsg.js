import React from 'react';
import { auth, db } from "../../firebase";
import firebase from "firebase/app";

import spinner from "../../assets/spinner.svg";


function SendImageMsg({currentUser}) {
    return (
        <form id="image-form" className="img-form" action="#">
            <label htmlFor="mediaCapture" className="add-image__label">
                <i className="fas fa-camera add-image__icon"/>
            </label>
            <input onChange={ (e)=>onMediaFileSelected(e, currentUser) } id="mediaCapture" type="file" accept="image/*"
                   capture="camera" className="custom-file-input"/>
        </form>
    );
}

function onMediaFileSelected(e, currentUser) {
    e.preventDefault();
    const file = e.target.files[0];
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
    saveImageMessage(file, currentUser);
}

// Saves a new message containing an image in Firebase.
// This first saves the image in Firebase storage.
function saveImageMessage(file, currentUser) {
    const {uid, photoURL} = auth.currentUser;
    const messagesRef = db.collection('messages');

    // 1 - We add a message with a loading icon that will get updated with the shared image.
    messagesRef.add({
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL,
        color: currentUser.themeColor,
        senderName: currentUser.chatName,
        senderIcon: currentUser.chatIcon,
        imageUrl: spinner,

    }).then((messageRef)=>{
        // 2 - Upload the image to Cloud Storage.
        const filePath = firebase.auth().currentUser.uid + '/' + messageRef.id + '/' + file.name;
        return firebase.storage().ref(filePath).put(file).then((fileSnapshot)=>{
            // 3 - Generate a public URL for the file.
            return fileSnapshot.ref.getDownloadURL().then((url)=>{
                // 4 - Update the chat message placeholder with the image's URL.
                return messageRef.update({
                    imageUrl: url,
                    storageUri: fileSnapshot.metadata.fullPath
                });
            });
        });
    }).catch((error)=>console.error('There was an error uploading a file to Cloud Storage:', error));
}


export default SendImageMsg;
