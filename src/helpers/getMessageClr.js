function getMessageClr(clr) {
    switch (clr) {
        case('yellow'):
            return '#FFC68A';
        case ('green'):
            return '#4acfac';
        case('pink'):
            return '#ffa2bb';
        case ('purple'):
            return '#7e8ce0';
        case('blue'):
            return '#36c7d0';
    }
}

export default getMessageClr;