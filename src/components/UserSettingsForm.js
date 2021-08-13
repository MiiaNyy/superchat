import React, { useState } from "react";
import { auth, db } from "../firebase";
import firebase from "firebase";

function UserSettingsForm({userSettingsOpen, update}) {

    const [userName, setUserName] = useState('');
    const [userColor, setUserColor] = useState('');

    function submitSettings(e) {
        e.preventDefault();
        const {uid, displayName} = auth.currentUser;

        db.collection("users").doc(uid).set({
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            fullName: displayName,
            chatName: userName,
            themeColor: userColor
        })
            .then(()=>{
                console.log("Document successfully added to collection!");
                userSettingsOpen(false);
            })
            .catch((error)=>{
                console.error("Error when adding document: ", error);
            });
    }

    return (
        <div className="pop-up">
            <h2>Settings</h2>
            <form onSubmit={ (e)=>submitSettings(e) }>
                <input type="text" placeholder="Current user name" onChange={ (e)=>setUserName(e.target.value) }/>
                <div>
                    <ColorRadioBtn clr="yellow" setUserColor={ setUserColor }/>
                    <ColorRadioBtn clr="blue" setUserColor={ setUserColor }/>
                    <ColorRadioBtn clr="purple" setUserColor={ setUserColor }/>
                    <ColorRadioBtn clr="pink" setUserColor={ setUserColor }/>
                    <ColorRadioBtn clr="green" setUserColor={ setUserColor }/>
                </div>
                <button>Save</button>
            </form>
            { update ? <button onClick={ ()=>userSettingsOpen(false) }>close window</button> : <></> }
        </div>
    )
}

function ColorRadioBtn({clr, setUserColor}) {
    return (
        <label htmlFor={ `${ clr }-color` } className="clr-container">{ clr }
            <input type="radio" name="radio" id={ `${ clr }-color` } value={ clr }
                   onChange={ (e)=>setUserColor(e.target.value) }/>
            <span id={ clr } className="checkmark"/>
        </label>
    )

}

export default UserSettingsForm;