import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocation, faLocationDot, faPersonRifle, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import { FaChildren } from "react-icons/fa6";
import { IoPerson } from "react-icons/io5";
import { SiGoogleforms } from "react-icons/si";
import { IoMdCall } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { FaRegCircle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

import DashboardCard from './elements/DashboardCard';
import orphanageCover from '../assets/images/orphanage.jpg'

const Overview = () => {
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const [orphanage, setOrphanage] = useState({});
  const [socialWorkerList, setSocialWorkerList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [childrenList, setChildrenList] = useState([]);
  const [head, setHead] = useState({});

  useEffect(() => {
    const getOrphanage = async () => {
      try {
        const response = await axiosPrivate.get('/orphanage');
        const selectedOrphanage = response.data.orphanageList.find((orphanage) => orphanage.orphanageid === id);
        setOrphanage(selectedOrphanage);
      } catch (error) {
        console.error('Failed to fetch orphanages:', error);
      }
    };

    const getAllSocialWorkers = async () => {
      try {
        const response = await axiosPrivate.get(`/socialworker/all?orphanageid=${id}`);
        setSocialWorkerList(response.data.socialWorkerList);
      } catch (error) {
        console.error('Failed to fetch social workers:', error);
      }
    };

    const getAllStaff = async () => {
      try {
        const response = await axiosPrivate.get(`/staff/?orphanageid=${id}`);
        setStaffList(response.data.staffList);
      } catch (error) {
        console.error('Failed to fetch staff:', error);
      }
    };

    const getChildren = async () => {
      try {
        const response = await axiosPrivate.get(`/child/orphanage/${id}`);
        setChildrenList(response.data.childrenList);
      } catch (error) {
        console.error('Failed to fetch children:', error);
      }
    };

    const getHead = async () => {
      try {
        const response = await axiosPrivate.get(`/orphanage/head?orphanageid=${id}`);
        setHead(response.data.headDetails);
      } catch (error) {
        console.error('Failed to fetch head:', error);
      }
    };

    getOrphanage();
    getAllSocialWorkers();
    getAllStaff();
    getChildren();
    getHead();
  }, [id, axiosPrivate]);

  return (
    <div className='mx-5'>
      <div className='grid'>

        <div className="card bg-base-100 w-full shadow-xl rounded-lg mb-10 pb-10 h-fit">
          <h2 className="card-title text-4xl text-center mt-5 mb-1 mx-auto">{orphanage.orphanagename}</h2>
          <div className=' items-center text-base mx-auto mb-5'>
            <span className='px-2 '><div className="badge bg-orange-300  border-transparent">{orphanage.orphanageid}</div></span>
          </div>
          <figure>
            <img
              className='w-full md:w-1/3 p-2'
              src={orphanageCover}
              alt="Shoes" />
          </figure>

          <div className="card-body">
            <div className='grid sm:grid-cols-2 '>
              <div className='flex flex-col w-fit mx-auto'>
                <h2 className="card-title text-2xl text-center mt-5 mb-1 ">Orphanage Details</h2>
                <div className='flex flex-row items-center'>
                  <IoMdCall />
                  <span className='ml-2'>Contact : </span>
                  <span className='px-2 badge bg-red-300'>{orphanage.telno}</span>
                </div>
                <div className='flex flex-row items-center'>
                  <FaLocationDot />
                  <span className='ml-2' >Address : </span>
                  <span className='px-2 badge bg-red-300'>{orphanage.address}</span>
                </div>
                <div className='flex flex-row  items-center'>
                  <FaRegCircle />
                  <span className='ml-2' >Capacity : </span>
                  <span className='px-2  badge bg-red-300'>{orphanage.capacity}</span>
                </div>
              </div>

              <div className='flex flex-col w-fit mx-auto'>
                <h2 className="card-title text-2xl text-center mt-5 mb-1">Head Details</h2>
                <div className=' items-center'>
                  <FontAwesomeIcon
                    icon={faUser} />
                  <span className='px-2'>Orphanage Head : <div className='badge bg-green-300'>{head.username}</div></span>
                </div>

                <div className=' items-center'>
                  <FontAwesomeIcon
                    icon={faPhone} />
                  <span className='px-2 '>Tel. No. :  <div className='badge bg-green-300'>{head.telno}</div></span>
                </div>
                <div className='flex flex-row items-center'>
                  <MdEmail />
                  <span className='px-2 '>Email :  <div className='badge bg-green-300'>{head.email}</div></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10'>

        <DashboardCard title={childrenList.length} text={'Total Children'} icon={<FaChildren />} iconColor={'green'} />
        <DashboardCard title='-' text={'Total Cases'} icon={<SiGoogleforms />} iconColor={'blue'} />
        <DashboardCard title={staffList.length} text={'Staff Members'} icon={<IoPerson />} iconColor={'red'} />
        <DashboardCard title={socialWorkerList.length} text={'Social Workers'} icon={<IoPerson />} iconColor={'yellow'} />

      </div>
      <div className='grid sm:grid-cols-2 gap-4'>

        <div className="  mx-auto card bg-base-100 w-full shadow-xl rounded-lg overflow-x-auto mb-10 p-5">
          <h1 className='text-2xl text-center my-5'>Staff Members</h1>
          <table className="table table-zebra">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Username</th>
                <th>Tel. No.</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {/* Check if there are social workers in the list */}
              {staffList.length > 0 ? (
                staffList.map((sw, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{sw.username}</td>
                    <td>{sw.telno}</td>
                    <td>{sw.email}</td>
                  </tr>
                ))
              ) : (
                // Render a single row with a colspan to show the 'No social workers found' message
                <tr>
                  <td colSpan="4" className="text-center">No staff found.</td>
                </tr>
              )}
            </tbody>
          </table>

        </div>

        <div className=" mx-auto card bg-base-100 w-full shadow-xl rounded-lg overflow-x-auto mb-10 p-5">
          <h1 className='text-2xl text-center my-5'>Social Workers</h1>
          <table className="table table-zebra">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Username</th>
                <th>Tel. No.</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}

              {socialWorkerList.length > 0 ? (
                socialWorkerList.map((sw, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{sw.username}</td>
                    <td>{sw.telno}</td>
                    <td>{sw.email}</td>
                  </tr>

                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No social workers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>

  );
};

export default Overview;
