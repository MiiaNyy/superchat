import React, { useState } from "react";
import { auth, db } from "../../firebase";
import firebase from "firebase/app";

import getUserIcons from "../../helpers/getIconImages";
import IconRadioButton from "./IconRadioButton";
import ColorRadioButton from "./ColorRadioButton";

import getFirstNameFromFullName from "../../helpers/getFirstNameFromFullName";

function UserSettingsForm ({
                               updatingSettings, // is user updating settings or setting them first time
                               userSettingsSet, // user settings has been set
                               userData,
                               setUserData, // set current user data
                               userSettingsOpen, // is settings pop uo open or closed
                               loadingSpinnerOn, // adds loading spinner to screen when user is updating settings
                               moveToChatRoom,
                           }) {
    
    const {uid, displayName} = auth.currentUser;
    const iconArr = getUserIcons();
    
    const [userName, setUserName] = useState(updatingSettings ? userData.chatName : getFirstNameFromFullName(displayName));
    const [userColor, setUserColor] = useState(updatingSettings ? userData.themeColor : '');
    const [userIcon, setUserIcon] = useState(updatingSettings ? userData.chatIcon : '');
    
    function submitSettings (e) {
        e.preventDefault();
        const formValues = {
            chatName: userName === undefined || userName === '' ? getFirstNameFromFullName(displayName) : userName,
            chatIcon: userIcon,
            themeColor: userColor === undefined || userColor === '' ? 'pink' : userColor,
        }
        if ( updatingSettings ) {
            loadingSpinnerOn(true);
            updateUserSettings(formValues)
                .then(r => window.location.reload());
        } else {
            firstTimeSubmittingSettings(formValues, moveToChatRoom)
                .then(r => console.log('user settings submitted'));
        }
    }
    
    async function updateUserSettings (formValues) {
        try {
            await db.collection("users").doc(uid).update(formValues);
            
            userSettingsOpen(() => false);
            setUserData((prev) => {
                // data that does not need to be updated
                const prevData = {
                    createdAt: prev.createdAt,
                    lastSeen: prev.lastSeen,
                    fullName: prev.fullName
                }
                return {...prevData, ...formValues};
            })
        } catch (e) {
            console.error("Error when updating user settings document: ", e)
        }
    }
    
    async function firstTimeSubmittingSettings (formValues, moveToChatRoom) {
        userSettingsSet(true);
        
        const userDocument = {
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            fullName: displayName,
            uid,
            chatName: formValues.chatName,
            chatIcon: formValues.chatIcon,
            themeColor: formValues.themeColor,
        };
        // First set changed to firebase
        try {
            await db.collection("users").doc(uid).set(userDocument)
            setUserData(() => userDocument); // set user data to user document, so it can be accessed later
            moveToChatRoom(true);
            console.log("Document successfully added to collection!")
        } catch (e) {
            console.error("Error when adding user settings document: ", e)
        }
    }
    
    return (
        <div className="pop-up">
            { updatingSettings ? <div className="close_cont"><i className="fas fa-times close-settings"
                                                                onClick={ () => userSettingsOpen(() => false) }/>
            </div> : <></> }
            <h2 style={ {marginTop: updatingSettings ? 'initial' : '1em'} }>{ updatingSettings ? 'Update' : 'Choose your user' } settings</h2>
            <form onSubmit={ (e) => submitSettings(e) }>
                <div className="settings__cont">
                    <p>User name</p>
                    <input className="settings__name" type="text" value={ userName }
                           onChange={ (e) => setUserName(e.target.value) }/>
                </div>
                <div className="settings__cont">
                    <p>Theme color</p>
                    <div className="flex">
                        <ColorRadioButton clr="yellow" userColor={ userColor } setUserColor={ setUserColor }/>
                        <ColorRadioButton clr="blue" userColor={ userColor } setUserColor={ setUserColor }/>
                        <ColorRadioButton clr="purple" userColor={ userColor } setUserColor={ setUserColor }/>
                        <ColorRadioButton clr="pink" userColor={ userColor } setUserColor={ setUserColor }/>
                        <ColorRadioButton clr="green" userColor={ userColor } setUserColor={ setUserColor }/>
                    </div>
                </div>
                
                <div className="settings__cont settings__icons">
                    <p>Chat icon</p>
                    <div className="flex">
                        { iconArr.map((icon) => {
                            return <IconRadioButton icon={ icon } userIcon={ userIcon } setUserIcon={ setUserIcon }/>
                        }) }
                    </div>
                </div>
                
                <button className="btn btn__settings" type="submit">Save</button>
            </form>
        </div>
    )
}




export default UserSettingsForm;
