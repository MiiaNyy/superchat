import React from 'react';
import getUserIconImg from "../../helpers/getUserIconImg";
import { UserColor } from "../styledComponents/GeneralStyles";

function User({user}) {
    return (
        <div className="flex online__user">
            <UserColor color={ user.themeColor }/>
            <img width={ 30 } height={ 30 } src={ getUserIconImg(user.chatIcon) } alt=""/>
            <p>{ user.chatName }</p>
        </div>
    )


}

export default User;