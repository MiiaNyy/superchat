import React from 'react';
import { UserColor } from "../styled_components/GeneralStyles";

function User({user, currentUser}) {

    return (
        <div className="flex online__user">
            <UserColor color={ user.themeColor }/>
            <p>{ currentUser ? 'You' : user.chatName }</p>
        </div>
    )
}

export default User;
