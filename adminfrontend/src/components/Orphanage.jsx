import React, { useState, useEffect, useMemo } from "react";
import orphanageImage from "../assets/images/orphanage1.jpg";
import Overview from "./Overview";
import Children from "./Children";
import ApplicationList from "./ApplicationList";
import CasesList from "./CasesList";
import useLogout from "../hooks/useLogout";
import { Requests } from "./Requests";
import useAuth from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";

const ROLES = {
  User: 1010,
  Head: 1910,
  Staff: 5528,
  SocialWorker: 2525,
  Admin: 7788,
};

const Orphanage = () => {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const view = queryParams.get('view');

  const navigate = useNavigate();
  const logout = useLogout();
  const { auth } = useAuth();
  const [selectedTab, setSelectedTab] = useState(view === 'child' ? 'Child Management' : 'Overview');
  const [type, setType] = useState('');
  const [role, setRole] = useState('')

  const orphanageTabs = useMemo(() => {
    const baseTabs = [
      { label: 'Overview' },
      { label: 'Child Management' },
      { label: 'Case Management' },
      { label: 'Request Management' }
    ];

    if (auth.roles.includes(ROLES.Admin)) {
      baseTabs.splice(1, 3);
    }
    else if (auth.roles.includes(ROLES.Head)) {
      baseTabs.splice(2, 0, { label: 'Adoption Management' }); // Add Applications tab
      setType('received');
      setRole('Head')
    }
    else if (auth.roles.includes(ROLES.Staff)) {
      baseTabs.splice(2, 1);
      setType('sent');
      setRole('Staff')
    }
    else {
      baseTabs.splice(0, 4, { label: 'Case Management' }); // Add Cases tab
      setSelectedTab('Case Management');
    }
    return baseTabs;
  }, [auth.roles]);

  const renderTabContent = () => {
    switch (selectedTab) {
      case "Overview":
        return <Overview />;
      case "Child Management":
        return <Children role={role} />;
      case "Request Management":
        return <Requests type={type} role={role} />;
      case "Adoption Management":
        return <ApplicationList />;
      case "Case Management":
        return <CasesList />;
      default:
        return null;
    }
  };



  const signout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col lg:flex-row mt-20">

      {/*side bar*/}
      <ul className="menu w-80 p-0 [&_li>*]:rounded-none hidden lg:block ml-5" >
        <li className='menu-title text-3xl mx-auto'>Dashboard</li>
        {orphanageTabs.map((tab, index) => {
          return (


            <li key={index} onClick={() => setSelectedTab(tab.label)} className={`${selectedTab == tab.label && 'bg-gray-200'}`} >
              <div>
                <span className="inline-flex items-center justify-center text-3xl">
                  { }
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
          {orphanageTabs.map((tab, index) =>
            (<li onClick={() => setSelectedTab(tab.label)} className={`${selectedTab == tab.label && 'bg-gray-200'}`} key={index}><a>{tab.label}</a></li>)
          )}
        </ul>
      </div>

      {/* Scrollable side */}
      <div className=" overflow-y-auto h-[90vh] w-full">
        {renderTabContent()}
      </div>
    </div>

  );
};

export default Orphanage;