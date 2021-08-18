import getUserIcons from "./getIconImages";

export default function getUserIconImg(imgName) {
    const icons = getUserIcons();

    for (let i = 0; i < icons.length; i++) {
        let icon = icons[i];
        if ( icon.name === imgName ) {
            return icon.img
        }
    }
}