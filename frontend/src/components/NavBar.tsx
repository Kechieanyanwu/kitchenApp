import React from 'react';
// import { NavLink } from 'react-router-dom';

export default function NavBar() {
    return (
        <nav>
            {/* Navigation links */}
            <button>Home</button>
            <button>Checklist</button>
            <button>Inventory</button>
            <button>Settings</button>
        </nav>
    );
};

// {/* <a href="#"> Home</a>
// <a> Home</a>
// <a> Home</a>
// <a> Home</a> */}
// export default function NavBar() {
//     return (
//         <nav>
//             {/* Navigation links */}
//             <NavLink to="/">Home</NavLink>
//             <NavLink to="/checklist">Checklist</NavLink>
//             <NavLink to="/inventory">Inventory</NavLink>
//             <NavLink to="/settings">Settings</NavLink>
//         </nav>
//     );
// };