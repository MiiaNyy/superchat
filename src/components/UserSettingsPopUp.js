function UserSettingsPopUp() {
    return (
        <div className="pop-up">
            <h2>Settings</h2>
            <form>
                <input type="text" placeholder="Current user name"/>
                <div>
                    <label htmlFor="yellow-clr" className="clr-container">Yellow
                        <input type="radio" name="radio" id="yellow-clr" value="yellow"/>
                        <span id="yellow" className="checkmark"/>
                    </label>
                    <label htmlFor="blue-clr" className="clr-container">blue
                        <input type="radio" name="radio" id="blue-clr" value="blue"/>
                        <span id="blue" className="checkmark"/>
                    </label>
                    <label htmlFor="pink-clr" className="clr-container">pink
                        <input type="radio" name="radio" id="pink-clr" value="pink"/>
                        <span id="pink" className="checkmark"/>
                    </label>
                    <label htmlFor="purple-clr" className="clr-container">purple
                        <input type="radio" name="radio" id="purple-clr" value="purple"/>
                        <span id="purple" className="checkmark"/>
                    </label>
                    <label htmlFor="green-clr" className="clr-container">green
                        <input type="radio" name="radio" id="green-clr" value="green"/>
                        <span id="green" className="checkmark"/>
                    </label>
                </div>

                <button>Start chatting</button>
            </form>
        </div>
    )
}

export default UserSettingsPopUp;