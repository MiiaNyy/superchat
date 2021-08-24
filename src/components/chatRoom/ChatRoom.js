import React, { useState } from "react";
import UserSettingsForm from "../UserSettingsForm";
import ChatMessages from "./ChatMessages";
import NewMessageForm from "./NewMessageForm";
import Sidebar from "./Sidebar";

function ChatRoom({userData, logOff}) {
    const [currentUser, setCurrentUser] = useState(userData);
    const [userSettingsOpen, setUserSettingsOpen] = useState(false);

    return (
        <>
            <header className="chat__header">
                <h2>Hello { currentUser.chatName }!</h2>
                <p> Welcome to Super chat!</p>
            </header>

            <Sidebar setUserSettingsOpen={ setUserSettingsOpen } logOff={ logOff }/>
            <ChatMessages/>
            <NewMessageForm currentUser={ currentUser }/>

            { userSettingsOpen ?
                <UserSettingsForm updatingSettings={ true } userData={ userData } setUserData={ setCurrentUser }
                                  userSettingsOpen={ setUserSettingsOpen }/> : <></> }
        </>
    )
}


export default ChatRoom;