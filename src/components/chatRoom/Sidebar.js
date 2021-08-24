import React, { useState } from "react";
import OnlineUsersList from "./OnlineUsersList";

function Sidebar({logOff, setUserSettingsOpen}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

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
    if ( sidebarOpen ) {
        document.querySelector("main").style.gridTemplateColumns = "50px repeat(2, 1fr)";
        setSidebarOpen(false);
    } else {
        document.querySelector("main").style.gridTemplateColumns = "200px repeat(2, 1fr)";
        setSidebarOpen(true);
    }
}

export default Sidebar;