import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import firebase from "firebase";

function UserSettingsForm({updatingSettings, userSettingsSet, setUserData, userSettingsOpen, userData}) {
    const {uid, displayName, photoURL} = auth.currentUser;

    const [userName, setUserName] = useState('');
    const [userColor, setUserColor] = useState('');
    const [userIcon, setUserIcon] = useState('');

    const [loadingComplete, setLoadingComplete] = useState(false);

    const [iconArr, setIconArr] = useState(getUserIcons());

    useEffect(()=>{
        // Run this when page first renders
        if ( updatingSettings ) {
            setUserName(()=>userData.chatName)
            setUserColor(()=>userData.themeColor);
            setUserIcon(()=>userData.chatIcon)
            console.log('updating settings');
        } else {
            console.log('first login')
            setUserName(()=>getFirstName(displayName))
        }
        setLoadingComplete(true);

    }, [])


    function submitSettings(e) {
        e.preventDefault();
        if ( updatingSettings ) {
            db.collection("users").doc(uid).update({
                chatName: userName !== '' ? userName : getFirstName(displayName),
                chatIcon: userIcon,
                themeColor: userColor !== '' ? userColor : 'pink',
            })
                .then(()=>{

                    userSettingsOpen( () =>false);
                    setUserData((prev) => {
                        return {
                            createdAt: prev.createdAt,
                            lastSeen: prev.lastSeen,
                            fullName: prev.fullName,
                            chatName: userName !== '' ? userName : getFirstName(displayName),
                            chatIcon: userIcon,
                            themeColor: userColor !== '' ? userColor : 'pink',
                        }
                    })

                    console.log("User settings document successfully updated to collection!")
                })
                .catch((error)=>console.error("Error when updating user settings document: ", error));
        } else {
            firstTimeSubmittingSettings();
        }
    }

    function firstTimeSubmittingSettings() {
        const userDocument = {
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            fullName: displayName,
            chatName: userName !== '' ? userName : getFirstName(displayName),
            chatIcon: userIcon,
            themeColor: userColor !== '' ? userColor : 'pink',
            uid,
        };
        // First set changed to firebase
        db.collection("users").doc(uid).set(userDocument)
            .then(()=>{
                setUserData(()=>userDocument); // set user data to user document, so it can be accessed later
                userSettingsSet(true);
                console.log("Document successfully added to collection!")
            })
            .catch((error)=>console.error("Error when adding user settings document: ", error));
    }

    if ( loadingComplete ) {
        return (
            <div className="pop-up">
                <h2>Settings</h2>
                <form onSubmit={ (e)=>submitSettings(e) }>
                    <input type="text" value={ userName } onChange={ (e)=>setUserName(e.target.value) }/>
                    <div>
                        <ColorRadioBtn clr="yellow" userColor={ userColor } setUserColor={ setUserColor }/>
                        <ColorRadioBtn clr="blue" userColor={ userColor } setUserColor={ setUserColor }/>
                        <ColorRadioBtn clr="purple" userColor={ userColor } setUserColor={ setUserColor }/>
                        <ColorRadioBtn clr="pink" userColor={ userColor } setUserColor={ setUserColor }/>
                        <ColorRadioBtn clr="green" userColor={ userColor } setUserColor={ setUserColor }/>
                    </div>

                    <div>
                        <IconRadioBtn icon={ {name: 'default', img: photoURL} } userIcon={ userIcon }
                                      setUserIcon={ setUserIcon }/>
                        { iconArr.map((icon)=>{
                            return <IconRadioBtn icon={ icon } userIcon={ userIcon } setUserIcon={ setUserIcon }/>
                        }) }
                    </div>
                    <button>Save</button>
                </form>
                { updatingSettings ? <button onClick={ ()=>userSettingsSet(false) }>close window</button> : <></> }
            </div>
        )
    } else {
        return (
            <div className="pop-up">
                <p>loading...</p>
            </div>
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
        <label htmlFor={ `${ clr }-color` } className="clr-container">{ clr }
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

function getUserIcons() {
    return [
        {
            name: 'blonde-hair',
            img: "https://image.flaticon.com/icons/png/512/2945/2945423.png"
        },
        {
            name: 'black-hair',
            img: "https://image.flaticon.com/icons/png/512/2945/2945462.png"
        },
        {
            name: 'dino-head',
            img: "https://image.flaticon.com/icons/png/512/2945/2945324.png"
        },
        {
            name: 'summer_hat',
            img: "https://image.flaticon.com/icons/png/512/2945/2945430.png"
        },
        {
            name: 'glasses-and-mustache',
            img: "https://image.flaticon.com/icons/png/512/2945/2945483.png"
        },
        {
            name: 'green-and-black-hair',
            img: "https://image.flaticon.com/icons/png/512/2945/2945341.png"
        }
    ];
}


export default UserSettingsForm;