import React, { Component } from 'react'; 

import { NavLink } from 'react-router-dom';

// Utility classes for button styles
const buttonClasses = 'focus:outline-none text-black bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:ring-[#ff5722]orange-300 rounded-lg text-2xl px-5 py-2.5 me-2 mb-2 dark:focus:ring-orange-800';
const buttonClassesgeneral = 'focus:outline-none hover:bg-orange-700 focus:ring-4 focus:ring-orange-300 rounded-lg text-2xl px-5 py-2.5 me-2 mb-2 dark:focus:ring-orange-800';

export class Navbar extends Component {
    render() {
        return (
            <nav className='bg-slate-200 w-full z-40 fixed border-b-2 border-black-500'>
                <div className="text-black text-2xl flex justify-between items-center p-4">
                    <a href="./userdash">
                        <img src="https://i.imgur.com/VXw99Rp.jpg" alt="logo" className='w-36' />
                    </a>
                    <div className='space-x-4'>
                        <NavLink to="/inbox" className={`p-2 ${buttonClassesgeneral}`}>Contact</NavLink>
                        <NavLink to="/" className={`p-2 ${buttonClasses}`}>LogOut</NavLink>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Navbar;
