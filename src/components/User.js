import React from 'react';
import { auth } from "../firebase";
import getUserIconImg from "../helpers/getUserIconImg";
import { UserColor } from "./styledComponents/Styles";

function User({user}) {
    const {uid} = auth.currentUser;

    const currentTimestamp = new Date() / 1000;
    const userLastSeen = getUsersLastVisit(user);

    // Dont show current users name and check if user has been seen in last 5min on server
    return user.uid !== uid && (userLastSeen >= (currentTimestamp - (60 * 5))) ? (
        <div className="flex online__user">
            <UserColor color={user.themeColor}/>
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