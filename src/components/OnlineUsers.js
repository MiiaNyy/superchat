import React from 'react';
import { auth, db } from "../firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";


function OnlineUsers(props) {
    const messagesRef = db.collection('users');
    const query = messagesRef.orderBy('createdAt').limit(50);
    const [users] = useCollectionData(query, {idField: 'id'});

    const {uid} = auth.currentUser;

    return (
        <section className="chat__users">
            <h2>People that are online</h2>
            { users && users.map((user)=>{
                return <User key={ user.id } user={ user }/>
            }) }
        </section>
    );
}

function User(props) {
    const user = props.user;

    const currentTimestamp = new Date() / 1000;
    const userLastSeen = getUsersLastVisit(user);

    const fiveMinutesAgo = 60 * 5;


    if ( userLastSeen >= (currentTimestamp - fiveMinutesAgo) ) {
        console.log('user last seen', userLastSeen);
        console.log('timestamp', currentTimestamp)
        return (
            <p>{ user.name }</p>
        )
    } else {
        return <></>
    }

}


function getUsersLastVisit(user) {
    const userLastSeenString = user.lastSeen.seconds + '.' + user.lastSeen.nanoseconds;
    return Number(userLastSeenString);
}


export default OnlineUsers;