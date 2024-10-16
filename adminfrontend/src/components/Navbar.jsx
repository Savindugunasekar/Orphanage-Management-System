import React, { useEffect, useState } from 'react';
import { LuMail } from "react-icons/lu";
import { Link } from 'react-router-dom';
import { FaSignOutAlt } from "react-icons/fa";
import useLogout from '../hooks/useLogout';
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Badge from './elements/Badge';

const ROLES = {
    User: 1010,
    Head: 1910,
    Staff: 5528,
    SocialWorker: 2525,
    Admin: 7788,
};

const NavBar = () => {
    const { auth } = useAuth();
    const logout = useLogout();
    const axiosPrivate = useAxiosPrivate();

    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [homeRoute, setHomeRoute] = useState('/');
    const [inboxRoute, setInboxRoute] = useState('/');
    const [inbox, setInbox] = useState(false);
    const [role, setRole] = useState('')

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axiosPrivate.get(`/notifications?userId=${auth.userId}`);
                if (response.data.success) {
                    setNotifications(response.data.notifications);
                }
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            }
        };

        if (auth && auth.userId) {
            fetchNotifications();
        }
    }, [axiosPrivate, auth]);

    const routes = {
        admin: {
            home: '/admin',
            inbox: '/admin/inbox',
        },
        head: {
            home: `/orphanage/${auth?.orphanageId}`,
        },
        staff: {
            home: `/orphanage/${auth?.orphanageId}`,
        },
        socialWorker: {
            home: `/orphanage/${auth?.orphanageId}`,
            inbox: '/orphanage/inbox',
        },
        user: {
            home: '/user/dashboard',
            inbox: '/user/inbox',
        }
    };


    useEffect(() => {
        if (auth && auth.roles) {
            if (auth.roles.includes(ROLES.Admin)) {
                setRole('admin')
                setHomeRoute(routes.admin.home);
                setInboxRoute(routes.admin.inbox);
                setInbox(true);
            } else if (auth.roles.includes(ROLES.Head)) {
                setRole('head')
            } else if (auth.roles.includes(ROLES.Staff)) {
                setRole('staff')
            } else if (auth.roles.includes(ROLES.SocialWorker)) {
                setRole('social')
                // setInbox(true);
                setHomeRoute(routes.head.home);
                //setInboxRoute(routes.socialWorker.inbox);
            } else if (auth.roles.includes(ROLES.User)) {
                setRole('user')
                setHomeRoute(routes.user.home);
                setInboxRoute(routes.user.inbox);
                setInbox(true);
            }
        }
    }, [auth]);

    const signOut = async () => {
        await logout();
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    return (
        <div className="navbar bg-base-100 fixed top-0 left-0 w-full z-10 shadow-md ">

            <div className="flex-1">
                <a className="btn btn-ghost w-fit px-1" href={homeRoute}>
                    <img src="https://i.imgur.com/VXw99Rp.jpg" alt="logo" className="w-36" />
                </a>
                <Badge type={role} />
            </div>

            <div className="flex-none">
                {inbox && (
                    <Link to={inboxRoute}>
                        <button className="btn btn-ghost btn-circle">
                            <div className="indicator">
                                <LuMail className="h-5 w-5" />
                                {/* Removed the badge from the inbox icon */}
                            </div>
                        </button>
                    </Link>
                )}

                {/* Notification Icon */}
                <button
                    className="btn btn-ghost btn-circle mx-2 relative"
                    onClick={() => setShowNotificationModal(!showNotificationModal)}>
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
                        <span className="badge badge-xs badge-error indicator-item">
                            {notifications.length > 0 ? notifications.length : 0}
                        </span>
                    </div>
                </button>

                {/* Notification Modal */}
                {showNotificationModal && (
                    <div className="fixed top-20 border right-5 bg-white shadow-xl rounded-2xl w-72 z-50">
                        <div className="p-4">
                            <h4 className="font-semibold text-xl text-gray-800">Notifications</h4>
                            {notifications.length > 0 ? (
                                <ul className="my-4 space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400">
                                    {notifications.map((notification, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start p-3 bg-gray-100 rounded-lg shadow-sm text-sm text-gray-800"
                                        >
                                            <span className="flex-1">{notification}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-600 text-center mt-4">No notifications available.</p>
                            )}
                            {notifications.length > 0 && (
                                <button
                                    className="w-full mt-4 bg-primary text-white px-4 py-2 rounded-full text-center transition duration-300 ease-in-out"
                                    onClick={clearNotifications}
                                >
                                    Clear All
                                </button>
                            )}
                        </div>
                    </div>
                )}



                <Link to={"/login"}>
                    <button aria-label="Logout" onClick={signOut} className="btn btn-ghost btn-circle">
                        <div className="indicator">
                            <FaSignOutAlt className="h-5 w-5" />
                        </div>
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default NavBar;
