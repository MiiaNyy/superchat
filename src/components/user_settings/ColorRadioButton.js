function ColorRadioButton ({clr, setUserColor, userColor}) {
    
    return (
        <label htmlFor={ `${ clr }-color` } className="clr-container">
            <input type="radio" name="radio" id={ `${ clr }-color` } checked={ userColor === clr } value={ clr }
                   onChange={ (e) => setUserColor(e.target.value) }/>
            <span id={ clr } className="checkmark"/>
        </label>
    )
}

export default ColorRadioButton;
