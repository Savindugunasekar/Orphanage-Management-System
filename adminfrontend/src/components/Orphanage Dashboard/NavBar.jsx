import React from 'react';
import { LuMail } from "react-icons/lu";
import { Link } from 'react-router-dom';
import { FaSignOutAlt } from "react-icons/fa";
import useLogout from '../../hooks/useLogout';
import useAuth from "../../hooks/useAuth";

const OrphanageNavBar = () => {

    const { auth } = useAuth();
    const logout = useLogout();
    const signout = async () => {
        await logout();
    };

    const baseTabs = [
        { label: 'Overview' },
        { label: 'Children' },
        { label: 'Cases' },
        { label: 'Requests' }
    ];

    console.log(auth)

    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li><a>Item 1</a></li>
                        <li>
                            <a>Parent</a>
                            <ul className="p-2">
                                <li><a>Submenu 1</a></li>
                                <li><a>Submenu 2</a></li>
                            </ul>
                        </li>
                        <li><a>Item 3</a></li>
                    </ul>
                </div>
                <div className="flex-1">
                    <a className="btn btn-ghost w-fit px-1" href={`/orphanage/${auth.orphanageId}`}>
                        <img src="https://i.imgur.com/VXw99Rp.jpg" alt="logo" className="w-36" />
                    </a>
                </div>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><a>Item 1</a></li>
                    <li>
                        <details>
                            <summary>Parent</summary>
                            <ul className="p-2">
                                <li><a>Submenu 1</a></li>
                                <li><a>Submenu 2</a></li>
                            </ul>
                        </details>
                    </li>
                    <li><a>Item 3</a></li>
                </ul>
            </div>
            <div className="navbar-end">
                <Link to='/user/inbox'>
                    <button className="btn btn-ghost btn-circle">

                        <div className="indicator">
                            <LuMail className="h-5 w-5" />
                            <span className="badge badge-xs badge-error indicator-item"></span>
                        </div>
                    </button></Link>
                <button className="btn btn-ghost btn-circle mx-2">
                    <div className="indicator">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="badge badge-xs badge-error indicator-item"></span>
                    </div>
                </button>
                <Link to={"/login"}>
                    <button onClick={signout} className="btn btn-ghost btn-circle">

                        <div className="indicator">
                            <FaSignOutAlt className="h-5 w-5" />
                        </div>
                    </button></Link>
            </div>
        </div>
    );
};

export default OrphanageNavBar;