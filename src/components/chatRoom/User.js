import React from 'react';
import getUserIconImg from "../../helpers/getUserIconImg";
import { UserColor } from "../styledComponents/GeneralStyles";

function User({user, currentUser}) {

    return (
        <div className="flex online__user">
            <UserColor color={ user.themeColor }/>
            <img width={ 30 } height={ 30 } src={ getUserIconImg(user.chatIcon) } alt="user icon"/>
            <p>{ currentUser ? 'You' : user.chatName }</p>
        </div>
    )


}

export default User;