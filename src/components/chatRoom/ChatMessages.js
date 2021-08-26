import React, { useEffect, useRef, useState } from "react";
import { auth, db } from "../../firebase";

import uniqid from "uniqid";
import getUserIconImg from "../../helpers/getUserIconImg";

import spinner from "../../assets/spinner.svg";
import { Message, MessageContainer, SenderInfo, SentTime } from "../styledComponents/MessageStyles";


function ChatMessages({changingMessageSettings}) {
    const scrollDownRef = useRef();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        db.collection('messages').orderBy('createdAt').limit(100)
            .onSnapshot((snapshot)=>{
                setMessages(snapshot.docs.map(doc=>doc.data()));
                setLoading(false);
            })
    }, [])

    // Scrolls when page first loads
    useEffect(()=>{
        if ( !loading ) {
            scrollDownRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [loading])

    // Scrolls after new message arrives
    useEffect(()=>{
        if ( !loading ) {
            scrollDownRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [messages])

    // When user is changing their settings and press submit, set loading to true and after updating user settings
    // to message documents are done change loading to false. So loading spinner is shown on the screen.
    useEffect(()=>{
        setLoading(!loading)
    }, [changingMessageSettings])


    if ( loading ) {
        return (
            <section className="chat__messages">
                <img width={ 90 } height={ 90 } style={ {margin: "2em auto"} } src={ spinner } alt="loading"/>
            </section>
        )
    } else {
        return (
            <section className="chat__messages">
                { messages.map((msg, index)=>{
                    return <ChatMessage key={ uniqid() } message={ msg }/>
                }) }
                <div id="scrollDown" ref={ scrollDownRef }/>
            </section>
        )
    }
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
    if ( timestamp ) {
        const wholeDate = new Date(timestamp.seconds * 1000);
        const year = wholeDate.getFullYear();
        const month = wholeDate.getMonth();
        const day = wholeDate.getDate();
        const hour = wholeDate.getHours();
        let minutes = wholeDate.getMinutes();

        // If the message is send in the same day as today, return only time, else return date
        if ( currentDate.getMonth() === month && currentDate.getDate() === day ) {
            if ( minutes < 10 ) {
                minutes = '0' + minutes
            }
            return `${ hour }:${ minutes }`
        }
        return `${ day }/${ month + 1 }/${ year }`
    }


}

export default ChatMessages;