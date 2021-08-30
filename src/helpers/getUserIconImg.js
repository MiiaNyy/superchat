import getUserIcons from "./getIconImages";
import black_hair from "../assets/black-hair.png" // default value

export default function getUserIconImg(imgName) {
    const icons = getUserIcons();
    let iconImg;
    for (let i = 0; i < icons.length; i++) {
        let icon = icons[i];
        if ( icon.name === imgName ) {
            iconImg = icon.img
        }
    }
    return iconImg ? iconImg : black_hair;
}

