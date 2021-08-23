import { auth, db } from "../firebase";
import React, { useEffect, useRef, useState } from "react";
import firebase from "firebase";

import SendImageMsg from "./SendImageMsg";
import OnlineUsersList from "./OnlineUsersList";
import UserSettingsForm from "./UserSettingsForm";

import getUserIconImg from "../helpers/getUserIconImg";
import { Message, MessageContainer, SenderInfo, SentTime } from "./styledComponents/Styles";

import spinner from "../spinner.svg";
import uniqid from "uniqid"

function ChatRoom({userData}) {
    const [currentUser, setCurrentUser] = useState(userData);
    const [userSettingsOpen, setUserSettingsOpen] = useState(false);

    function Sidebar() {
        const [sidebarOpen, setSidebarOpen] = useState(true);

        return (
            <>
                <section className="sidebar">
                    <i className={ `fas ${ sidebarOpen ? 'fa-times' : 'fa-bars' } sidebar__toggle` }
                       onClick={ ()=>toggleSidebar(sidebarOpen, setSidebarOpen) }/>

                    <div className={ `sidebar__content ${ sidebarOpen ? 'visible' : 'hidden' }` }>
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
            <ChatMessages/>
            <NewMessageForm currentUser={ currentUser }/>

            { userSettingsOpen ?
                <UserSettingsForm updatingSettings={ true } userData={ userData } setUserData={ setCurrentUser }
                                  userSettingsOpen={ setUserSettingsOpen }/> : <></> }
        </>
    )
}

function ChatMessages({}) {
    const scrollDownRef = useRef();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scrollDown, setScrollDown] = useState(false);

    useEffect(()=>{
        db.collection('messages').orderBy('createdAt').limit(100)
            .onSnapshot((snapshot)=>{
                setMessages(snapshot.docs.map(doc=>doc.data()));
                setLoading(false);
            })
    }, [])


    if ( loading ) {
        return (
            <section className="chat__messages">
                <img width={ 90 } height={ 90 } style={ {margin: "2em auto"} } src={ spinner } alt="loading"/>
            </section>
        )
    } else {
        return (
            <section className="chat__messages">
                { messages.map((msg)=>{
                    return <ChatMessage key={ uniqid() } message={ msg }/>
                }) }
                <div id="scrollDown" ref={ scrollDownRef }/>
            </section>
        )
    }
}

function NewMessageForm({currentUser}) {
    const [formValue, setFormValue] = useState('');

    // writes new document to firestore
    function sendMessage(e) {
        e.preventDefault();
        const {uid, photoURL} = auth.currentUser;
        console.log('new message is:', formValue)
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

function ChatMessage({message}) {
    const {text, uid, imageUrl, senderName, senderIcon, color, createdAt} = message;
    // Give different styling depending if msg is sent by current user or received
    const messageClass = uid === auth.currentUser.uid ? 'msgSent' : 'msgReceived';
    const messageSentTime = getMsgCreatedTime(createdAt);

    if ( createdAt ) {
        return (
            <div className="message">
                <SenderInfo info={ "name" }
                            msgClass={ messageClass }>{ messageClass === 'msgSent' ? 'You' : senderName }</SenderInfo>
                <MessageContainer msgClass={ messageClass }>
                    <img width={ 25 } height={ 25 } src={ getUserIconImg(senderIcon) }
                         alt={ `${ senderIcon } user icon` }/>
                    <Message msgClass={ messageClass } color={ color }>
                        { imageUrl ? <img className="msgImg" src={ imageUrl } alt="sent image"/> :
                            < p> { text }</p> }
                        <SentTime msgClass={ messageClass }>{ messageSentTime }</SentTime>
                    </Message>
                </MessageContainer>
            </div>
        )
    } else {
        return <></>
    }
}

function getMsgCreatedTime(timestamp) {
    const currentDate = new Date();

    const wholeDate = new Date(timestamp * 1000);
    const year = wholeDate.getFullYear();
    const month = wholeDate.getMonth();
    const day = wholeDate.getDate();

    if ( currentDate.getMonth() === month && currentDate.getDate() === day ) {
        return `${ wholeDate.getHours() }:${ wholeDate.getMinutes() }`
    } else {
        return `${ day }/${ month }/${ year }`
    }

}

function toggleSidebar(sidebarOpen, setSidebarOpen) {
    if ( sidebarOpen ) {
        document.querySelector("main").style.gridTemplateColumns = "50px repeat(2, 1fr)";
        setSidebarOpen(false);
    } else {
        document.querySelector("main").style.gridTemplateColumns = "200px repeat(2, 1fr)";
        setSidebarOpen(true);
    }
}


export default ChatRoom;