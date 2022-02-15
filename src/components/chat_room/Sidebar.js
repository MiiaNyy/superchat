import React, { useState } from "react";
import OnlineUsersList from "./OnlineUsersList";

function Sidebar({logOff, setUserSettingsOpen}) {
    const biggerScreen = window.innerWidth >= 600; // Different styles on mobile devices and bigger screens
    const [sidebarOpen, setSidebarOpen] = useState(biggerScreen);

    return (
        <>
            <section className="sidebar">
                <i className={ `fas ${ sidebarOpen ? 'fa-times' : 'fa-bars' } sidebar__toggle` }
                   onClick={ ()=>toggleSidebar(sidebarOpen, setSidebarOpen) }/>

                <div className={ `sidebar__content ${ sidebarOpen ? 'visible' : 'hidden' }` }>
                    <OnlineUsersList/>
                    <button className="btn btn__settings" onClick={ ()=>setUserSettingsOpen(true) }>Settings <i
                        className="fas fa-cog"/></button>
                    <button className="btn btn__sign-out" onClick={ ()=>logOff() }>Sign out
                    </button>
                </div>
            </section>
        </>
    )
}

function toggleSidebar(sidebarOpen, setSidebarOpen) {
    const sidebarWidth = !sidebarOpen ? window.innerWidth >= 600 ? 200 : 150 : 50;
    document.querySelector("main").style.gridTemplateColumns = `${ sidebarWidth }px repeat(2, 1fr)`;
    setSidebarOpen(prev=>!prev);
}

export default Sidebar;