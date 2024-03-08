import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
    return (
        <nav>
            {/* Navigation links */}
            <NavLink to="/">Home</NavLink>
            <NavLink to="/checklist">Checklist</NavLink>
            <NavLink to="/inventory">Inventory</NavLink>
            <NavLink to="/settings">Settings</NavLink>
        </nav>
    );
};

export default NavBar;
