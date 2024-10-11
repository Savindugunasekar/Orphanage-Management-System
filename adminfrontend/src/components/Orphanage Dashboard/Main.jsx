import React, { useState, useEffect, useMemo } from "react";
import Overview from "../Overview";
import Children from "../Children";
import ApplicationList from "../ApplicationList";
import CasesList from "../CasesList";
import useLogout from "../../hooks/useLogout";
import { Requests } from "../Requests";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import SideBar from "./SideBar";

const ROLES = {
  User: 1010,
  Head: 1910,
  Staff: 5528,
  SocialWorker: 2525,
  Admin: 7788,
};

const OrphanageDashboard = () => {

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
      { label: 'Requests' }
    ];

    if (auth.roles.includes(ROLES.Admin)) {
      baseTabs.splice(1, 3);
    }
    else if (auth.roles.includes(ROLES.Head)) {
      baseTabs.splice(2, 0, { label: 'Applications' }); // Add Applications tab
      setType('received');
    }
    else if (auth.roles.includes(ROLES.Staff)) {
      setType('sent');
    }
    else {
      baseTabs.splice(0, 4, { label: 'Cases' }); // Add Cases tab
      setSelectedTab('Cases');
    }
    return baseTabs;
  }, [auth.roles]);

  const renderTabContent = () => {
    switch (selectedTab) {
      case "Overview":
        return <Overview />;
      case "Children":
        return <Children />;
      case "Requests":
        return <Requests type={type} />;
      case "Applications":
        return <ApplicationList />;
      case "Cases":
        return <CasesList />;
      default:
        return null;
    }
  };

  return (
    <div className='m-2 mt-20 ml-10'>
      <div className="h-screen flex-1 p-7">
        {renderTabContent()}
      </div>
    </div>

  );
};

export default OrphanageDashboard;