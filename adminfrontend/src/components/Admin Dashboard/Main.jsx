
import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import { MdDashboard } from "react-icons/md";
import { FaHouseUser } from "react-icons/fa";
import { MdAssignment } from "react-icons/md";

import { AdminOrphanage } from './AdminOrphanage';
import { AdminAssign } from './AdminAssign';
import ApplicationListAdmin from './ApplicationListAdmin';
import { AdminOverView } from './AdminOverView';
import Report from '../Report'

import { FaChildren } from 'react-icons/fa6'
import { FaHome } from "react-icons/fa";
import { IoPerson } from 'react-icons/io5';
import { SiGoogleforms } from 'react-icons/si';
import { FaFileWaveform } from "react-icons/fa6";

const AdminDashboard = () => {

    const baseTabs = [
        { label: 'Overview', icon: <MdDashboard /> },
        { label: 'Orphanage Management', icon: <FaHouseUser /> },
        { label: 'Staff Management', icon: <MdAssignment /> },
        { label: 'Adoption Management', icon: <SiGoogleforms /> },
        { label: 'Statistics & Reports', icon: <FaFileWaveform /> }
    ];

    const [selectedTab, setSelectedTab] = useState(baseTabs[0].label); // Default selected tab

    const [overview, setOverview] = useState([
        { parameter: 'Total Orphanages', value: '-', icon: <FaHome />, color: 'blue' },
        { parameter: 'Total Children', value: '-', icon: <FaChildren />, color: 'green' },
        { parameter: 'Total Staff Members', value: '-', icon: <IoPerson />, color: 'yellow' },
        { parameter: 'Total Social Workers', value: '-', icon: <IoPerson />, color: 'gray' },
        { parameter: 'Active Cases', value: '-', icon: <SiGoogleforms />, color: 'purple' },
        { parameter: 'Pending Adoption Applications', value: '-', icon: <FaFileWaveform />, color: 'red' }
    ]);

    const renderTabContent = () => {
        switch (selectedTab) {
            case baseTabs[0].label:
                return <AdminOverView overview={overview} />;
            case baseTabs[1].label:
                return <AdminOrphanage orphanageList={orphanageList} setOrphanageList={setOrphanageList} getAllOrphanages={getAllOrphanages} />;
            case baseTabs[2].label:
                return <AdminAssign orphanageList={orphanageList} />;
            case baseTabs[3].label:
                return <ApplicationListAdmin />;
            case baseTabs[4].label:
                return <Report />;
            default:
                return null;
        }
    };

    const axiosPrivate = useAxiosPrivate()
    const [orphanageList, setOrphanageList] = useState([])

    const getAllOrphanages = async () => {
        try {
            const response = await axiosPrivate.get('/orphanage')
            console.log("inside the getallorphanages", response.data.orphanageList)
            setOrphanageList(response.data.orphanageList)

        } catch (error) {
            console.error('Failed to fetch orphanages:', error);
        }
    }
    const getOverview = async () => {
        try {
            const response = await axiosPrivate.get('/orphanage/overview')
            setOverview([
                { parameter: 'Total Orphanages', value: response.data.data.orphanageCount, icon: <FaHome />, color: 'blue' },
                { parameter: 'Total Children', value: response.data.data.childCount, icon: <FaChildren />, color: 'green' },
                { parameter: 'Total Staff Members', value: response.data.data.staffCount, icon: <IoPerson />, color: 'yellow' },
                { parameter: ' Total Social Workers', value: response.data.data.socialWorkerCount, icon: <IoPerson />, color: 'gray' },
                { parameter: 'Active Cases', value: response.data.data.ongoingCaseCount, icon: <SiGoogleforms />, color: 'purple' },
                { parameter: 'Pending Adoption Applications', value: response.data.data.pendingApplicationCount, icon: <FaFileWaveform />, color: 'red' }
            ])
        } catch (error) {
            console.error('Failed to fetch overview:', error);
        }
    }

    useEffect(() => {
        getOverview()
        getAllOrphanages()
    }, [])

    return (
        <div className='flex flex-col sm:flex-row mt-20' id='adminPanel'>

            {/*side bar*/}
            <ul className="menu w-80 p-0 [&_li>*]:rounded-none hidden lg:block ml-5" >
                <li className='menu-title text-3xl mx-auto'>Dashboard</li>
                {baseTabs.map((tab, index) => {
                    return (


                        <li key={index} onClick={() => setSelectedTab(tab.label)} className={`${selectedTab == tab.label && 'bg-gray-200'}`} >
                            <div>
                                <span className="inline-flex items-center justify-center text-3xl">
                                    {tab.icon}
                                </span>
                                <span className=" tracking-wide truncate text-[1rem]">{tab.label}</span>
                            </div>
                        </li>

                    )
                })}
            </ul>

            {/* drop down for mobile */}
            <div className="dropdown lg:hidden">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
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
                            d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                </div>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                    {baseTabs.map((tab, index) =>
                        (<li onClick={() => setSelectedTab(tab.label)} className={`${selectedTab == tab.label && 'bg-gray-200'}`} key={index}><a>{tab.label}</a></li>)
                    )}
                </ul>
            </div>


            {/*main content*/}
            <div className=' overflow-y-auto h-[85vh] w-full'>
                {renderTabContent()}
            </div>

        </div>
    );
};

export default AdminDashboard;
