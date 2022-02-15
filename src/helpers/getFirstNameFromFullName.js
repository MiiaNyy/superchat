function getFirstNameFromFullName (fullName) {
    const nameArr = fullName.split(' ');
    return nameArr[0];
}

export default getFirstNameFromFullName;
