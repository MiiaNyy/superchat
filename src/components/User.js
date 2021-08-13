import React from 'react';



function User(props) {
    const user = props.user;

    const currentTimestamp = new Date() / 1000;
    const userLastSeen = getUsersLastVisit(user);

    if ( userLastSeen >= (currentTimestamp - (60 * 5)) ) {
        return (
            <p>{ user.name }</p>
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