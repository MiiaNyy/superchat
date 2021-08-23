import { auth, db } from "../firebase";
import React, { useEffect, useRef, useState } from "react";
import firebase from "firebase";

import SendImageMsg from "./SendImageMsg";
import OnlineUsersList from "./OnlineUsersList";
import UserSettingsForm from "./UserSettingsForm";

import uniqid from "uniqid";

import getUserIconImg from "../helpers/getUserIconImg";
import { Message, MessageContainer, MsgSenderName } from "./styledComponents/Styles";

function ChatRoom({userData}) {
    const [currentUser, setCurrentUser] = useState(userData);
    const [userSettingsOpen, setUserSettingsOpen] = useState(false);
    const [formValue, setFormValue] = useState('');

    const [sidebarOpen, setSidebarOpen] = useState(true);

    const scrollDownRef = useRef();

    const [messages, setMessages] = useState([]);


    useEffect(()=>{
        db.collection('messages').orderBy('createdAt').limit(100)
            .onSnapshot((snapshot)=>{
                setMessages(snapshot.docs.map(doc=>doc.data()))
            })
    }, [])


    useEffect(()=>{
        scrollDownRef.current.scrollIntoView({behavior: 'smooth'});
    }, [messages])

// writes new document to firestore
    async function sendMessage(e) {
        e.preventDefault();
        const {uid, photoURL} = auth.currentUser;

        // create new document with these values
        await db.collection('messages').add({
            senderName: currentUser.chatName,
            senderIcon: userData.chatIcon,
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL,
            color: currentUser.themeColor
        });
        setFormValue('');
        scrollDownRef.current.scrollIntoView({behavior: 'smooth'});
    }

    function Sidebar() {
        return (
            <>
                <section className="sidebar">
                    <i className={ `fas ${ sidebarOpen ? 'fa-times' : 'fa-bars' } sidebar__toggle` }
                       onClick={ ()=>toggleSidebar(sidebarOpen, setSidebarOpen) }/>

                    <div className={`sidebar__content ${sidebarOpen ? 'visible' : 'hidden'}`}>
                        <OnlineUsersList/>
                        <button className="btn btn__settings" onClick={ ()=>setUserSettingsOpen(true) }>Settings <i
                            className="fas fa-cog"/></button>
                        <button className="btn btn__sign-out" onClick={ ()=>auth.signOut() }>Sign out</button>
                    </div>
                </section>
            </>
        )
    }


    return (
        <>
            <header className="chat__header">
                <h2>Hello { currentUser.chatName }!</h2>
                <p> Welcome to Super chat!</p>
            </header>

            <Sidebar/>

            <section className="chat__messages">
                { messages.map((msg, index)=>{
                    return <ChatMessage key={ uniqid() } message={ msg }/>
                }) }
                <div id="scrollDown" ref={ scrollDownRef }/>
            </section>

            <section className="form-flex">
                <SendImageMsg/>
                <form className="msg-form" onSubmit={ (e)=>sendMessage(e) }>
                    <input type="text" placeholder="Send message..." value={ formValue }
                           onChange={ (e)=>setFormValue(e.target.value) }/>
                    <button type="submit"><i className="fas fa-share add-msg__icon"/></button>
                </form>
            </section>

            { userSettingsOpen ?
                <UserSettingsForm updatingSettings={ true } userData={ userData } setUserData={ setCurrentUser }
                                  userSettingsOpen={ setUserSettingsOpen }/> : <></> }
        </>
    )
}

function ChatMessage({message}) {
    const {text, uid, imageUrl, senderName, senderIcon, color} = message;
    // Give different styling depending if msg is sent by current user or received
    const messageClass = uid === auth.currentUser.uid ? 'msgSent' : 'msgReceived';

    return (
        <div className="message">
            <MsgSenderName msgClass={ messageClass }>{ messageClass === 'msgSent' ? 'You' : senderName }</MsgSenderName>
            <MessageContainer msgClass={ messageClass }>
                <img width={ 25 } height={ 25 } src={ getUserIconImg(senderIcon) }
                     alt={ `${ senderIcon } user icon` }/>
                <Message msgClass={ messageClass } color={ color }>
                    { imageUrl ? <img className="msgImg" src={ imageUrl } alt="sent image"/> :
                        < p> { text }</p> }
                </Message>
            </MessageContainer>
        </div>
    )
}

function toggleSidebar(sidebarOpen, setSidebar) {
    if ( sidebarOpen ) {
        document.querySelector("main").style.gridTemplateColumns = "50px repeat(2, 1fr)";
        setSidebar(false);
    } else {
        document.querySelector("main").style.gridTemplateColumns = "200px repeat(2, 1fr)";
        setSidebar(true);
    }
}


export default ChatRoom;