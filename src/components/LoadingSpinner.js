import spinner from "../assets/spinner.svg";
import React from "react";

function LoadingSpinner() {
    return <img width={ 90 } height={ 90 } style={ {margin: "2em auto", gridArea: "1/2/2/2"} } src={ spinner }
                alt="loading"/>
}

export default LoadingSpinner;