// import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { House, ListCheck, List } from "react-bootstrap-icons";

function NavExample() {

}


export default function NavBar() {
    const doSomething = () => { };
    return (
        <nav>
            {/* Navigation links */}
            <div
                className='footer-button active'
                onClick={() => doSomething()}
            >
                <House></House>
                <div>Home</div>
            </div>

            <div
                className='footer-button'
                onClick={() => doSomething()}
            >
                <ListCheck></ListCheck>
                <div>Checklist</div>
            </div>

            <div
                className='footer-button'
                onClick={() => doSomething()}
            >
                <List></List>
                <div>Inventory</div>
            </div>

            <div
                className='footer-button'
                onClick={() => doSomething()}
            >
                <House></House>
                <div>Settings</div>
            </div>
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