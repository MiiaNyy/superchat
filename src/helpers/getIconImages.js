import blond from "../assets/blond.png"
import green_and_black_hair from "../assets/green-and-black.png"
import glasses_and_mustache from "../assets/mustache.png"
import summer_hat from "../assets/summer-hat.png"
import dino_head from "../assets/dino-head.png"
import black_hair from "../assets/black-hair.png"


export default function getUserIcons() {
    return [
        {
            name: 'blonde-hair',
            img: blond,
        },
        {
            name: 'black-hair',
            img: black_hair,
        },
        {
            name: 'dino-head',
            img: dino_head,
        },
        {
            name: 'summer_hat',
            img: summer_hat,
        },
        {
            name: 'glasses-and-mustache',
            img: glasses_and_mustache,
        },
        {
            name: 'green-and-black-hair',
            img: green_and_black_hair,
        }
    ];
}