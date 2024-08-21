import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { districts } from '../constants';
import Search from './Search';
import Dropdown from './Dropdown';
import { Link, useNavigate } from 'react-router-dom';
import { AssignModal } from './AssignModal';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useLogout from '../hooks/useLogout';
import ApplicationList from './ApplicationList';
import ApplicationListAdmin from './ApplicationListAdmin';

const AdminDash = () => {

  const axiosPrivate = useAxiosPrivate()

  const navigate = useNavigate()
  const logout = useLogout()

  const [orphanageList, setOrphanageList] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedAssign, setSelectedAssign] = useState("")

  const [showModal, setShowModal] = useState(false)

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



  const filteredOrphanageList = orphanageList.filter((orphanage) => {
    const matchesSearch = orphanage.orphanagename.toLowerCase().startsWith(searchTerm.toLowerCase());
    const matchesDistrict = selectedDistrict ? orphanage.district === selectedDistrict : true;
    return matchesSearch && matchesDistrict;
  });

  const handleClickOrphanage = (orphanageId) => {
    const path = `/orphanage/${orphanageId}`;
    navigate(path);
  };

  const handleDeleteOrphanage = async (orphanageId) => {
    try {
      console.log('Inside the handle Delete orphanage...');
      setOrphanageList(orphanageList.filter((orphanage) => orphanage.orphanageid !== orphanageId));
      console.log('filtere orphanage list...')
      await axiosPrivate.delete(`/orphanage/${orphanageId}`);
      console.log('Deleted orphanage');

    } catch (error) {
      console.error('Failed to delete orphanage:', error);

      setOrphanageList(orphanageList);
    }
  };


  const handleUpdateOrphanage = (orphanageId) => {
    const path = `/orphanage/${orphanageId}/edit`;
    navigate(path);
    console.log('Updating orphanage...');
  }

  const fetchMoreData = () => {
    console.log('Fetching more data...');
  };

  const sortedOrphanageList = [...filteredOrphanageList].sort((a, b) =>
    a.orphanagename.localeCompare(b.orphanagename)
  );

  const handleAssign = async (data) => {
    try {
      let response;
      if (selectedAssign === 'socialworker') {
        response = await axiosPrivate.post('/socialworker', data, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      } else if (selectedAssign === 'staff') {
        response = await axiosPrivate.post('/staff', data, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }

      if (response?.data.success) {
        console.log('assigned successfully');
      }

    } catch (error) {
      console.log(error);
    }
  }

  const signout = async () => {
    await logout();
    navigate('/')
  }



  return (
    <div>
      <nav className='flex items-center justify-between h-20 overflow-hidden bg-transparent shadow-lg ro-unded'>
        <div className='p-4'>
          <a href="./admin">
            <img src="https://i.imgur.com/VXw99Rp.jpg" alt="logo" className='w-36' />
          </a>
        </div>
        <div className='p-4'>
          <ul className='flex space-x-6'>
            <li>
              <Link to={'/admin'}>
                <button className='p-3 text-white rounded-xl bg-primary focus:outline-none hover:bg-orange-700'>
                  Home
                </button>
              </Link>
            </li>
            <li>
              <Link to={'/inbox'}>
                <button className='p-3 mx-5 text-white rounded-xl bg-primary focus:outline-none hover:bg-orange-700'>
                  Inbox
                </button>
              </Link>
            </li>
            <li>
              <button className='p-3 text-white rounded-xl bg-primary focus:outline-none hover:bg-orange-700' onClick={signout}>
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <h1 className="relative my-10 text-2xl font-bold text-center">
        Admin Dashboard
        <span className="block w-[100px] h-1 bg-primary mx-auto mt-3"></span>
      </h1>
      <style jsx>{`
        .infinite-scroll-container {
          height: 300px;
          overflow: auto;
        }
        .infinite-scroll-container::-webkit-scrollbar {
          width: 10px;
        }
        .infinite-scroll-container::-webkit-scrollbar-track {
          background: white;
        }
        .infinite-scroll-container::-webkit-scrollbar-thumb {
          background-color: #ff5722;
          border-radius: 10px;
          border: 3px solid #f1f1f1;
        }
        .infinite-scroll-container::-webkit-scrollbar-thumb:hover {
          background: #db4b1f;
        }
      `}</style>
      <div className='flex m-10'>
        <div class="m-20 max-w-sm rounded overflow-hidden shadow-lg">
          <img src="https://www.africacalling.org/wp-content/uploads/ghana-orphanage-volunteer-sarah-vigs-ghana-africa-sarah-from-uk.jpg" alt="Sunset in the mountains" />
          <div class="px-6 py-4">
            <div class="font-bold text-xl mb-2">Add an Orphanage</div>
            <p class="text-gray-700 text-base">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
            </p>
            <button className='p-3 m-5 text-white align-middle-full m rounded-xl bg-primary focus:outline-none hover:bg-orange-700'>
              <Link to={'/addOrphanage'}>Add an orphanage</Link>
            </button>
          </div>
        </div>

        <div class="m-20 max-w-sm rounded overflow-hidden shadow-lg">
          <img src="https://www.africacalling.org/wp-content/uploads/ghana-orphanage-volunteer-sarah-vigs-ghana-africa-sarah-from-uk.jpg" alt="Sunset in the mountains" />
          <div class="px-6 py-4">
            <div class="font-bold text-xl mb-2">Assign Social Worker</div>
            <p class="text-gray-700 text-base">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
            </p>
            <button
              className='p-3 m-5 text-white align-middle-full m rounded-xl bg-primary focus:outline-none hover:bg-orange-700'
              onClick={() => setShowModal(true)}
            >
              Assign social worker
            </button>
          </div>
        </div>

        <div class="m-20 max-w-sm rounded overflow-hidden shadow-lg">
          <img src="https://www.africacalling.org/wp-content/uploads/ghana-orphanage-volunteer-sarah-vigs-ghana-africa-sarah-from-uk.jpg" alt="Sunset in the mountains" />
          <div class="px-6 py-4">
            <div class="font-bold text-xl mb-2">Reports</div>
            <p class="text-gray-700 text-base">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
            </p>
            <button
              className='p-3 m-5 text-white align-middle-full m rounded-xl bg-primary focus:outline-none hover:bg-orange-700'
            >
              <Link to={'/viewReports'}>View Reports</Link>
            </button>
          </div>
        </div>

        <div class="m-20 max-w-sm rounded overflow-hidden shadow-lg">
          <img src="https://www.africacalling.org/wp-content/uploads/ghana-orphanage-volunteer-sarah-vigs-ghana-africa-sarah-from-uk.jpg" alt="Sunset in the mountains" />
          <div class="px-6 py-4">
            <div class="font-bold text-xl mb-2">Search Orphanages</div>
            <p class="text-gray-700 text-base">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
            </p>
            <button
              className='p-3 m-5 text-white align-middle-full m rounded-xl bg-primary focus:outline-none hover:bg-orange-700'
            >
              <Link to={'/searchOrphanges'}>Search Orphanages</Link>
            </button>
          </div>
        </div>

      </div>


      <div className='grid mb-3 md:grid-cols-2'>
        <div className='w-full '>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        <div className='w-full '>
          <Dropdown
            valueList={districts}
            onSelect={(district) => setSelectedDistrict(district)}
          />




        </div>


      </div>




      <InfiniteScroll

        className='mx-20 infinite-scroll-container'
        dataLength={sortedOrphanageList.length}
        next={fetchMoreData}
        hasMore={true}
        height={300}
      >
        {sortedOrphanageList.map((item, index) => (
          <div
            className='flex items-center justify-between px-10 py-2 text-sm border-gray-100 border-y-2 hover:bg-gray-100'
            key={index}
            onClick={() => handleClickOrphanage(item.orphanageid)}
          >
            {item.orphanagename}
            <div className='flex space-x-2'>
              <button
                className='px-3 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600'
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateOrphanage(item.orphanageid);
                }}
              >
                Update
              </button>
              <button
                className='px-3 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600'
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteOrphanage(item.orphanageid);
                }}
              >
                Delete
              </button>
            </div>
          </div>

        ))}
      </InfiniteScroll>

      <div >

        <button className='mx-20 my-3 py-3 text-white bg-primary px-2'
          onClick={() => {
            setShowModal(true)
            setSelectedAssign('socialworker')
          }}>
          Assign social worker
        </button>


        <button className='mx-20 my-3 py-3 text-white bg-primary px-2' onClick={() => {
          setShowModal(true)
          setSelectedAssign('staff')
        }}>
          Assign staff member
        </button>

        <AssignModal
          showModal={showModal}
          closeModal={() => {
            setSelectedAssign('')
            setShowModal(false)
          }}
          orphanageList={orphanageList}
          onSubmit={handleAssign} />

      </div>


      <ApplicationListAdmin />


    </div>




  );
};

export default AdminDash;
