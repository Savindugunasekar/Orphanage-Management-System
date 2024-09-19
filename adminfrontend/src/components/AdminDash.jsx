
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

const AdminDash = () => {

  const baseTabs = [
    { label: 'Overview', icon: <MdDashboard /> },
    { label: 'Orphanages', icon: <FaHouseUser /> },
    { label: 'Assign', icon: <MdAssignment /> },
    { label: 'Applications', icon: <SiGoogleforms /> },
    { label: 'Reports', icon: <FaFileWaveform /> }
  ];

  const [selectedTab, setSelectedTab] = useState(baseTabs[0].label); // Default selected tab

  const [overview, setOverview] = useState([
    { parameter: 'Orphanages', value: '-' },
    { parameter: 'Children', value: '-' },
    { parameter: 'Staff Members', value: '-' },
    { parameter: 'Social Workers', value: '-' },
    { parameter: 'Active Cases', value: '-' },
    { parameter: 'Pending Adoption Applications', value: '-' }
  ]);

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
    const getOverview = async () => {
      try {
        const response = await axiosPrivate.get('/orphanage/overview')
        setOverview([
          { parameter: 'Orphanages', value: response.data.data.orphanageCount },
          { parameter: 'Children', value: response.data.data.childCount },
          { parameter: 'Staff Members', value: response.data.data.staffCount },
          { parameter: 'Social Workers', value: response.data.data.socialWorkerCount },
          { parameter: 'Active Cases', value: response.data.data.ongoingCaseCount },
          { parameter: 'Pending Adoption Applications', value: response.data.data.pendingApplicationCount }
        ])
      } catch (error) {
        console.error('Failed to fetch overview:', error);
      }
    }
    getOverview()
    getAllOrphanages()
  }, [])

  const signout = async () => {
    await logout();
    navigate('/')
  }

  return (
    <div >

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

export default AdminDash;
