function getUsersLastVisit(user) {
    if ( user.lastSeen ) {
        return Number(user.lastSeen.seconds + '.' + user.lastSeen.nanoseconds);
    }
}

export default getUsersLastVisit;