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
            // https://image.flaticon.com/icons/png/512/2945/2945423.png
        },
        {
            name: 'black-hair',
            img: black_hair,
            //img: "https://image.flaticon.com/icons/png/512/2945/2945462.png"
        },
        {
            name: 'dino-head',
            img: dino_head,
            //img: "https://image.flaticon.com/icons/png/512/2945/2945324.png"
        },
        {
            name: 'summer_hat',
            img: summer_hat,
            //img: "https://image.flaticon.com/icons/png/512/2945/2945430.png"
        },
        {
            name: 'glasses-and-mustache',
            img: glasses_and_mustache,
            //img: "https://image.flaticon.com/icons/png/512/2945/2945483.png"
        },
        {
            name: 'green-and-black-hair',
            img: green_and_black_hair,
            //img: "https://image.flaticon.com/icons/png/512/2945/2945341.png"
        }
    ];
}