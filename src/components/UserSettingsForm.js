import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import firebase from "firebase";

import getUserIcons from "../helpers/getIconImages";
import LoadingSpinner from "./loadingSpinner";

function UserSettingsForm({
                              updatingSettings,
                              userSettingsSet,
                              setUserData,
                              userSettingsOpen,
                              userData,
                              changeMessageSettings,
                              moveToChatRoom,
                          }) {

    const {uid, displayName} = auth.currentUser;
    const iconArr = getUserIcons();

    const [userName, setUserName] = useState('');
    const [userColor, setUserColor] = useState('');
    const [userIcon, setUserIcon] = useState('');
    const [loadingComplete, setLoadingComplete] = useState(false);

    useEffect(()=>{
        // Run this when page first renders
        if ( updatingSettings ) {
            setUserName(()=>userData.chatName);
            setUserColor(()=>userData.themeColor);
            setUserIcon(()=>userData.chatIcon);
        } else {
            setUserName(()=>getFirstName(displayName))
            setLoadingComplete(true);
        }
        setLoadingComplete(true);
    }, [])

    function submitSettings(e) {
        e.preventDefault();
        const formValues = {
            chatName: userName === undefined || userName === '' ? getFirstName(displayName) : userName,
            chatIcon: userIcon,
            themeColor: userColor === undefined || userColor === '' ? 'pink' : userColor,
        }

        if ( updatingSettings ) {
            changeMessageSettings(true);
            updateUserSettings(formValues, changeMessageSettings);
        } else {
            firstTimeSubmittingSettings(formValues, moveToChatRoom);
        }
    }

    function updateUserSettings(formValues, changeMessageSettings) {
        db.collection("users").doc(uid).update(formValues)
            .then(()=>{
                userSettingsOpen(()=>false);
                setUserData((prev)=>{
                    const notUpdatedInfo = {
                        createdAt: prev.createdAt,
                        lastSeen: prev.lastSeen,
                        fullName: prev.fullName
                    }
                    return {...notUpdatedInfo, ...formValues};
                })
                changeSettingsForOlderMessages(formValues, changeMessageSettings);
                console.log("User settings document successfully updated to collection!")
            })
            .catch((error)=>console.error("Error when updating user settings document: ", error));
    }

    function changeSettingsForOlderMessages(newSettingsObj, changeMessageSettings) {
        firebase.firestore().collection("messages")
            .where("uid", "==", uid)
            .get()
            .then((querySnapshot)=>{
                querySnapshot.forEach((doc)=>{
                    doc.ref.update({
                        senderName: newSettingsObj.chatName,
                        senderIcon: newSettingsObj.chatIcon,
                        color: newSettingsObj.themeColor
                    })
                        .then(r=>console.log('message successfully updated'))
                        .catch(e=>console.log('error happened while trying to update message:', e))
                });
                changeMessageSettings(false);
            });
    }

    function firstTimeSubmittingSettings(formValues, moveToChatRoom) {
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
        db.collection("users").doc(uid).set(userDocument)
            .then(()=>{
                setUserData(()=>userDocument); // set user data to user document, so it can be accessed later
                moveToChatRoom(true);
                console.log("Document successfully added to collection!")
            })
            .catch((error)=>console.error("Error when adding user settings document: ", error));
    }

    if ( loadingComplete ) {
        return (
            <div className="pop-up">
                { updatingSettings ? <div className="close_cont"><i className="fas fa-times close-settings"
                                                                    onClick={ ()=>userSettingsSet(false) }/>
                </div> : <></> }
                <h2 style={ {marginTop: updatingSettings ? 'initial' : '1em'} }>{ updatingSettings ? 'Update' : 'Choose your user' } settings</h2>
                <form onSubmit={ (e)=>submitSettings(e) }>
                    <div className="settings__cont">
                        <p>User name</p>
                        <input className="settings__name" type="text" value={ userName }
                               onChange={ (e)=>setUserName(e.target.value) }/>
                    </div>
                    <div className="settings__cont">
                        <p>Theme color</p>
                        <div className="flex">
                            <ColorRadioBtn clr="yellow" userColor={ userColor } setUserColor={ setUserColor }/>
                            <ColorRadioBtn clr="blue" userColor={ userColor } setUserColor={ setUserColor }/>
                            <ColorRadioBtn clr="purple" userColor={ userColor } setUserColor={ setUserColor }/>
                            <ColorRadioBtn clr="pink" userColor={ userColor } setUserColor={ setUserColor }/>
                            <ColorRadioBtn clr="green" userColor={ userColor } setUserColor={ setUserColor }/>
                        </div>
                    </div>

                    <div className="settings__cont settings__icons">
                        <p>Chat icon</p>
                        <div className="flex">
                            { iconArr.map((icon)=>{
                                return <IconRadioBtn icon={ icon } userIcon={ userIcon } setUserIcon={ setUserIcon }/>
                            }) }
                        </div>
                    </div>

                    <button className="btn btn__settings" type="submit">Save</button>
                </form>

            </div>
        )
    } else {
        return (
            <LoadingSpinner/>
        )
    }
}

function IconRadioBtn({icon, setUserIcon, userIcon}) {

    return (
        <label htmlFor={ icon.name }>
            <input type="radio" id={ icon.name } checked={ userIcon === icon.name } value={ icon.name }
                   onChange={ (e)=>setUserIcon(e.target.value) }/>
            <img width="50" height="50" src={ icon.img } alt={ `${ icon.name } user icon` }/>
        </label>
    )
}

function ColorRadioBtn({clr, setUserColor, userColor}) {

    return (
        <label htmlFor={ `${ clr }-color` } className="clr-container">
            <input type="radio" name="radio" id={ `${ clr }-color` } checked={ userColor === clr } value={ clr }
                   onChange={ (e)=>setUserColor(e.target.value) }/>
            <span id={ clr } className="checkmark"/>
        </label>
    )
}


function getFirstName(fullName) {
    const nameArr = fullName.split(' ');
    return nameArr[0];
}


export default UserSettingsForm;