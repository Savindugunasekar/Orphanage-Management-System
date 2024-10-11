import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useLogout from '../hooks/useLogout';

import { RiInboxArchiveFill } from "react-icons/ri";
import { FaSignOutAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { FaHouseUser } from "react-icons/fa";
import { MdAssignment } from "react-icons/md";
import { SiGoogleforms } from "react-icons/si";
import { FaFileWaveform } from "react-icons/fa6";

import { AdminOrphanage } from './AdminOrphanage';
import { AdminAssign } from './AdminAssign';
import ApplicationListAdmin from './ApplicationListAdmin';
import { AdminOverView } from './AdminOverView';

export const DashDesign = () => {

    const baseTabs = [
        { label: 'Overview', icon: <MdDashboard /> },
        { label: 'Orphanages', icon: <FaHouseUser /> },
        { label: 'Assign', icon: <MdAssignment /> },
        { label: 'Applications', icon: <SiGoogleforms /> },
        { label: 'Reports', icon: <FaFileWaveform /> }
    ];

    const [selectedTab, setSelectedTab] = useState(baseTabs[0].label); // Default selected tab

    const overview = [
        { parameter: 'Orphanages', value: '-' },
        { parameter: 'Children', value: '-' },
        { parameter: 'Staff Members', value: '-' },
        { parameter: 'Social Workers', value: '-' },
        { parameter: 'Active Cases', value: '-' },
        { parameter: 'Pending Adoption Requests', value: '-' },
        { parameter: 'Completed Adoptions', value: '-' },
        { parameter: 'Scheduled Interviews', value: '-' }
    ];

    const renderTabContent = () => {
        switch (selectedTab) {
            case baseTabs[0].label:
                return <AdminOverView overview={overview} />;
            case baseTabs[1].label:
                return <AdminOrphanage orphanageList={orphanageList} setOrphanageList={setOrphanageList} />;
            case baseTabs[2].label:
                return <AdminAssign orphanageList={orphanageList} />;
            case baseTabs[3].label:
                return <ApplicationListAdmin />;
            case baseTabs[4].label:
                return;
            default:
                return null;
        }
    };

    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()
    const logout = useLogout()
    const [orphanageList, setOrphanageList] = useState([])

    useEffect(() => {
        const getAllOrphanages = async () => {
            try {
                const response = await axiosPrivate.get('/orphanage')
                console.log(response.data.orphanageList)
                setOrphanageList(response.data.orphanageList)

            } catch (error) {
                console.error('Failed to fetch orphanages:', error);
            }
        }
        getAllOrphanages()
    }, [])

    const signout = async () => {
        await logout();
        navigate('/')
    }

    return (
        <div >
            {/*nav bar*/}
            <div className='fixed top-0 left-0 h-[8vh] w-full bg-white drop-shadow-lg'>
                <nav className='flex items-center justify-between rounded h-full'>
                    <div className='flex items-center ml-6'>
                        <a href="./admin">
                            <img src="https://i.imgur.com/VXw99Rp.jpg" alt="logo" className='w-28' />
                        </a>
                    </div>
                    <div className='p-4'>
                        <ul className='flex space-x-6'>
                            <li>
                                <Link to={'/inbox'}>
                                    <button className='flex items-center px-6 py-2 min-w-[120px] text-center text-orange-600 border border-orange-600 rounded hover:bg-orange-600 hover:text-white active:bg-orange-500 focus:outline-none focus:ring'>
                                        <RiInboxArchiveFill />
                                        <p className='ml-1'> Inbox</p>
                                    </button>
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={signout}
                                    className='flex items-center px-6 py-2 min-w-[120px] text-center text-orange-600 border border-orange-600 rounded hover:bg-orange-600 hover:text-white active:bg-orange-500 focus:outline-none focus:ring'>
                                    <FaSignOutAlt />
                                    <p className='ml-1'> Sign Out</p>
                                </button>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
            {/*side bar*/}
            <div className='fixed  w-[15vw] h-[92vh] top-[8vh] bg-orange-50'>
                <div className="flex items-center justify-center h-14 border-b">
                    <div>Admin Dashboard</div>
                </div>
                <div className="overflow-y-auto overflow-x-hidden flex-grow">
                    <ul className="flex flex-col py-4 space-y-1">
                        <li className="px-5">
                            <div className="flex flex-row items-center h-8">
                                <div className="font-light tracking-wide text-gray-500">Menu</div>
                            </div>
                        </li>
                        {baseTabs.map((tab) => {
                            return (
                                <li>
                                    <div
                                        className={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-white text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-orange-600 pr-6 ${selectedTab === tab.label ? 'bg-white' : ''}`}
                                        onClick={() => setSelectedTab(tab.label)}>
                                        <span className="inline-flex justify-center items-center ml-4">
                                            {tab.icon}
                                        </span>
                                        <span className="ml-2 tracking-wide truncate">{tab.label}</span>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
            {/*main content*/}
            <div className='fixed top-[8vh] left-[15vw] w-[85vw] h-[92vh] p-2 overflow-y-auto m-2'>
                {renderTabContent()}
            </div>
        </div>
    );
};