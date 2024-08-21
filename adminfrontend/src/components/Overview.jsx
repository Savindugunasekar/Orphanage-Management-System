import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faLocation, faLocationDot, faPersonRifle, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';

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
    <div className='h-screen '> 
  <div className='flex'>

  <div className='w-[60%] h-full px-10 '>
    <div className='text-4xl font-bold text-primary pt-5 pb-5 '>{orphanage.orphanagename}</div>

    <div className='flex flex-col gap-2 '>
    <div className=' items-center'>
      <span className='text-lg text-primary font-bold '>Registration No:</span>

            <span className='px-2 text-lg font-semibold'>{orphanage.orphanageid}</span>
      </div>
      <div className=' items-center'>
      <span className='text-lg text-primary font-bold '>Contact:</span>

            <span className='px-2 text-lg font-semibold'>{orphanage.telno}</span>
      </div>
      <div className=' items-center'>

      <span className='text-lg text-primary font-bold '>Address:</span>
      

            <span className='px-2 text-lg font-semibold'>{orphanage.address}</span>
      </div>
      <div className=' items-center'>

      <span className='text-lg text-primary font-bold '>Capacity:</span>
      

            <span className='px-2 text-lg font-semibold'>{orphanage.capacity}</span>
      </div>
    </div>

    <h1 className='font-bold text-3xl mt-10 mr-10'>Orphanage Head</h1>

    <div className='flex flex-col gap-2 mt-5'>
    <div className=' items-center'>
      <FontAwesomeIcon
              icon={faUser}
              className='text-primary'
              
            />

            <span className='px-2 text-lg font-semibold'>{head.username}</span>
      </div>
      <div className=' items-center'>
        
      <FontAwesomeIcon
              icon={faPhone}
              className='text-primary'
              
            />

            <span className='px-2 text-lg font-semibold'>{head.telno}</span>
      </div>
      <div className=' items-center'>
      <FontAwesomeIcon
              icon={faLocationDot}
              className='text-primary'
              
            />

            <span className='px-2 text-lg font-semibold'>{head.email}</span>
      </div>
    </div>
    <div className=' border-3 mt-10  border-gray-100 h-[200px] w-[200px] flex items-center justify-center rounded-full shadow-lg ml-[400px]'>
  <div className='text-center'>
    <div className='text-gray-600 font-semibold text-xl mb-1'>Staff</div>
    <div className='text-primary text-7xl font-bold'>{staffList.length}</div>
  </div>
</div>
  
  </div>



    <div className='w-1/2  pt-1 px-10 '>
    <div className=' border-3  border-gray-100 h-[200px] w-[200px] flex items-center justify-center rounded-full shadow-lg'>
  <div className='text-center'>
    <div className='text-gray-600 font-semibold text-xl mb-1'>Children</div>
    <div className='text-primary text-7xl font-bold'>{childrenList.length}</div>
  </div>
</div>

<div className=' border-3  ml-40 border-gray-100 h-[200px] w-[200px] flex items-center justify-center rounded-full shadow-lg'>
  <div className='text-center'>
    <div className='text-gray-600 font-semibold text-xl mb-1'>Cases</div>
    <div className='text-primary text-7xl font-bold'>{childrenList.length}</div>
  </div>
</div>
<div className=' border-3  border-gray-100 h-[200px] w-[200px] flex items-center justify-center rounded-full shadow-lg'>
  <div className='text-center'>
    <div className='text-gray-600 font-semibold text-xl mb-1'>Social Wokers</div>
    <div className='text-primary text-7xl font-bold'>{socialWorkerList.length}</div>
  </div>
</div>
    </div>
   
  </div>

  <div className='flex bg-gray-50 px-10'>

     {/* Social Workers List */}
     <div className=" p-6  w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Social Workers</h2>
          {socialWorkerList.length > 0 ? (
            socialWorkerList.map((sw) => (
              <div key={sw.staffid} className="mb-4 flex items-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="mr-4">
                <img
                  src={'https://www.dgvaishnavcollege.edu.in/dgvaishnav-c/uploads/2021/01/dummy-profile-pic.jpg'}
                  alt={sw.username}
                  className="h-16 w-16 rounded-full object-cover border-2 border-primary"
                />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800">{sw.username}</p>
                <p className="text-sm text-gray-600">{sw.telno}</p>
                <p className="text-sm text-gray-600">{sw.email}</p>
              </div>
            </div>
            ))
          ) : (
            <p>No social workers found.</p>
          )}
        </div>

        {/* Staff List */}
        <div className=" w-1/2 p-6 ">
          <h2 className="text-2xl font-semibold mb-4">Staff</h2>
          {staffList.length > 0 ? (
            staffList.map((s) => (
              <div key={s.staffid} className="mb-4 flex items-center p-4 bg-white rounded-lg border border-gray-200">
  <div className="mr-4">
    <img
      src={'https://www.dgvaishnavcollege.edu.in/dgvaishnav-c/uploads/2021/01/dummy-profile-pic.jpg'}
      alt={s.username}
      className="h-16 w-16 rounded-full object-cover border-2 border-primary"
    />
  </div>
  <div>
    <p className="text-lg font-semibold text-gray-800">{s.username}</p>
    <p className="text-sm text-gray-600">{s.telno}</p>
    <p className="text-sm text-gray-600">{s.email}</p>
  </div>
</div>

            ))
          ) : (
            <p>No staff found.</p>
          )}
        </div>

  </div>
</div>

  );
};

export default Overview;
