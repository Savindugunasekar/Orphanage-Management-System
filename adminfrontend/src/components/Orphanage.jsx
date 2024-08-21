import React, { useState, useEffect, useMemo } from "react";
import orphanageImage from "../assets/images/orphanage1.jpg";
import Overview from "./Overview";
import Children from "./Children";
import ApplicationList from "./ApplicationList";
import CasesList from "./CasesList";
import useLogout from "../hooks/useLogout";
import { Requests } from "./Requests";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const ROLES = {
  User: 1010,
  Head: 1910,
  SocialWorker: 2525,
  Admin: 7788,
};

const Orphanage = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  const { auth } = useAuth();
  const [selectedTab, setSelectedTab] = useState('Overview');
  const [type, setType] = useState('');

  const orphanageTabs = useMemo(() => {
    const baseTabs = [
      { label: 'Overview' },
      { label: 'Children' },
      { label: 'Cases' },
      { label: 'Sent Requests' },
      { label: 'Received Requests' }
    ];

    if (auth.roles.includes(ROLES.Head)) {
      baseTabs.splice(2, 0, { label: 'Applications' }); // Add Applications tab
    }

    return baseTabs;
  }, [auth.roles]);

  const renderTabContent = () => {
    switch (selectedTab) {
      case "Overview":
        return <Overview />;
      case "Children":
        return <Children />;
      case "Sent Requests":
        return <Requests type={type} />;
      case "Received Requests":
        return <Requests type={type} />;
      case "Applications":
        return <ApplicationList />;
      case "Cases":
        return <CasesList />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (selectedTab === 'Sent Requests') {
      setType('sent');
    } else if (selectedTab === 'Received Requests') {
      setType('received');
    }
  }, [selectedTab]);

  const signout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="container mx-auto">
      {/* Fixed Navbar */}
      <nav className='fixed top-0 left-0 right-0 h-[70px] bg-white border-b-2 border-gray-200 z-10'>
        <div className='p-4 flex items-center justify-between'>
          <a href="#">
            <img src="https://i.imgur.com/VXw99Rp.jpg" alt="logo" className='w-36' />
          </a>
          <ul className='flex space-x-6'>
            <li>
              <button className='p-2 text-primary font-semibold border-2 border-primary rounded-md hover:bg-primary hover:text-white transition-colors duration-300' onClick={signout}>
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </nav>

      
      <div className="pt-[60px]">
        <div className="relative">
          {/* Mobile dropdown */}
          <div className="sm:hidden">
            <label htmlFor="Tab" className="sr-only">
              Tab
            </label>
            <select
              id="Tab"
              className="w-full rounded-md border-gray-200"
              value={selectedTab}
              onChange={(e) => setSelectedTab(e.target.value)}
            >
              {orphanageTabs.map((tab) => (
                <option key={tab.label} value={tab.label}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:flex">
            {/* Fixed side */}
            <div className="hidden lg:block lg:w-[20%] lg:fixed lg:top-[100px] lg:left-0 lg:h-[calc(100vh-60px)] lg:overflow-y-auto">
              <nav className="gap-6" aria-label="Tabs">
                {orphanageTabs.map((tab) => (
                  <div
                    key={tab.label}
                    className={`py-5 pl-5 border-y border-gray-200 font-semibold ${selectedTab === tab.label
                      ? "text-primary"
                      : "text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-100"
                      }`}
                    onClick={() => setSelectedTab(tab.label)}
                    aria-current={selectedTab === tab.label ? "page" : undefined}
                  >
                    {tab.label}
                  </div>
                ))}
              </nav>
            </div>

            {/* Scrollable side */}
            <div className="lg:ml-[20%] bg-gray-50 w-full h-[calc(100vh-80px)] overflow-y-auto">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orphanage;
