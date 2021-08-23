import getUserIcons from "./getIconImages";
import { auth } from "../firebase";

export default function getUserIconImg(imgName) {
    const {photoURL} = auth.currentUser;
    const icons = getUserIcons();
    let iconImg;
    for (let i = 0; i < icons.length; i++) {
        let icon = icons[i];
        if ( icon.name === imgName ) {
            iconImg = icon.img
        }
    }
    return iconImg ? iconImg : photoURL;
}

