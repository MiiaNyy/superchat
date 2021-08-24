import React from 'react';
import getUserIconImg from "../../helpers/getUserIconImg";
import { UserColor } from "../styledComponents/GeneralStyles";

function User({user}) {
    const currentTimestamp = new Date() / 1000;
    const userLastSeen = getUsersLastVisit(user);

    // Show user if they have been seen in last 3min on server
    return userLastSeen >= (currentTimestamp - (60 * 3)) ? (
        <div className="flex online__user">
            <UserColor color={ user.themeColor }/>
            <img width={ 30 } height={ 30 } src={ getUserIconImg(user.chatIcon) } alt=""/>
            <p>{ user.chatName }</p>
        </div>
    ) : <></>;
}

function getUsersLastVisit(user) {
    if ( user.lastSeen ) {
        return Number(user.lastSeen.seconds + '.' + user.lastSeen.nanoseconds);
    }
}

export default User;