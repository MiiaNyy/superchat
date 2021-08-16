import { useEffect, useState } from "react";
import { auth, db } from "../firebase";

import UserSettingsForm from "./UserSettingsForm";

function UserSettingsPopUp({setUserSettings}) {

    return <UserSettingsForm firstLogin={ true } userSettingsOpen={ setUserSettings }/>


}


export default UserSettingsPopUp;