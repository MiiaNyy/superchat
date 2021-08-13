import { useEffect, useState } from "react";
import { auth, db } from "../firebase";

import UserSettingsForm from "./UserSettingsForm";

function UserSettingsPopUp({setUserSettingsOpen}) {
    const [userHasNotSetSettings, setUserHasNotSetSettings] = useState(false);

    const {uid} = auth.currentUser;


    // check if user is new user or has they log into the chat before
    useEffect(()=>{
        db.collection('users').doc(uid).get().then((doc)=>{
            if ( !doc.exists ) {
                setUserHasNotSetSettings(true);
                console.log("New user detected, opening settings pop up");
            } else {
                console.log('user has already selected their settings. Continue to chat!')
                setUserSettingsOpen(false);
            }
        }).catch((error)=>{
            console.log("Error getting document:", error);
        });
    }, [])


    if ( userHasNotSetSettings ) {
        return <UserSettingsForm update={ false } userSettingsOpen={ setUserSettingsOpen }/>
    } else {
        return (
            <div className="pop-up">
                <p>loading...</p>
            </div>
        )
    }


}


export default UserSettingsPopUp;