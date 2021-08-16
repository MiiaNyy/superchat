import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import firebase from "firebase";


function UserSettingsForm({userSettingsSet, setUserData}) {
    const {uid, displayName, photoURL} = auth.currentUser;

    const [userName, setUserName] = useState('');
    const [userColor, setUserColor] = useState('');
    const [userIcon, setUserIcon] = useState('');

    const [loadingComplete, setLoadingComplete] = useState(false);
    const [firstLogin, setFirstLogin] = useState(true);

    const [iconArr, setIconArr] = useState(getUserIcons());

    useEffect(()=>{
        db.collection("users").doc(uid).get()
            .then((doc)=>{
                if ( doc.exists ) {
                    console.log('not first login')
                    setFirstLogin(false);

                    const data = doc.data();
                    setUserData(()=>doc.data())
                    setUserName(()=>data.chatName)
                    setUserColor(()=>data.themeColor);
                    setUserIcon(()=>data.chatIcon)
                } else {
                    // Users first login
                    console.log('first login')
                    setUserName(()=>getFirstName(displayName))
                }
                setLoadingComplete(true);
            })
            .catch((error)=>console.log('Error when getting document for user updates', error));

    }, [])


    function submitSettings(e) {
        e.preventDefault();
        if ( firstLogin ) {
            db.collection("users").doc(uid).set({
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
                fullName: displayName,
                chatName: userName !== '' ? userName : getFirstName(displayName),
                chatIcon: userIcon,
                themeColor: userColor !== '' ? userColor : 'pink',
                uid,
            })
                .then((response)=>{
                    console.log('submitting settings, data received is:', response)
                    userSettingsSet(true);
                    console.log("Document successfully added to collection!")
                })
                .catch((error)=>console.error("Error when adding user settings document: ", error));
        } else {
            db.collection("users").doc(uid).update({
                chatName: userName !== '' ? userName : getFirstName(displayName),
                chatIcon: userIcon,
                themeColor: userColor !== '' ? userColor : 'pink',
            })
                .then(()=>console.log("User settings document successfully updated to collection!"))
                .catch((error)=>console.error("Error when updating user settings document: ", error));
        }
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
                { firstLogin ? <></> : <button onClick={ ()=>userSettingsSet(false) }>close window</button> }
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

function getDocumentObj(method) {
    if ( method === 'update' ) {
        return
    }
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