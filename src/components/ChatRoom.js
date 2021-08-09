import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useState } from "react";
import firebase from "firebase";

function ChatRoom() {
    const [user] = useAuthState(auth);
    const [formValue, setFormValue] = useState('');

    const messagesRef = db.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(5);

    const [messages] = useCollectionData(query, {idField: 'id'});

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

    }

    return (
        <>
            <h2>Hello { user.displayName }!</h2>
            <p>Welcome to the chat room</p>
            <button onClick={ ()=>auth.signOut() }>Sign out</button>
            <h3>Messages:</h3>
            { messages && messages.map(msg=><ChatMessage key={ msg.id } message={ msg }/>) }

            <form onSubmit={ (e)=>sendMessage(e, messagesRef) }>
                <input type="text" value={ formValue } onChange={ (e)=>setFormValue(e.target.value) }/>
                <button type="submit">Send</button>
            </form>
        </>
    )
}


function ChatMessage(props) {
    const {text, uid, photoURL} = props.message;

    // Give different styling depending if msg is sent by current user or received
    const messageClass = uid === auth.currentUser.uid ? 'msgSent' : 'msgReceived';
    return (
        <div className="message">
            <div className={ messageClass }>
                <img src={ photoURL } alt=""/>
                < p> { text }</p>
            </div>
        </div>


    )
}


export default ChatRoom;