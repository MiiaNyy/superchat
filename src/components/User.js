import React from 'react';

import getUserIconImg from "../helpers/getUserIconImg";

function User({user}) {
    const currentTimestamp = new Date() / 1000;
    const userLastSeen = getUsersLastVisit(user);

    if ( userLastSeen >= (currentTimestamp - (60 * 5)) ) {
        return (
            <div>
                <img src={ getUserIconImg(user.chatIcon) } alt=""/>
                <p>{ user.chatName }</p>
            </div>
        )
    } else {
        return <></>
    }
}


function getUsersLastVisit(user) {
    if ( user.lastSeen ) {
        return Number(user.lastSeen.seconds + '.' + user.lastSeen.nanoseconds);
    }
}

export default User;