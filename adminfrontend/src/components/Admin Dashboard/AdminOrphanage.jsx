import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import toast from 'react-hot-toast';
import InfiniteScroll from 'react-infinite-scroll-component';
import Search from '../Search';
import Dropdown from '../Dropdown';
import { districts } from '../../constants';
import { Link, useNavigate } from 'react-router-dom';
import PrimaryButton from '../elements/PrimaryButton';
import OrphanageForm from './OrphanageForm';
import UpdateOrphanage from './UpdateOrphanage';
import { ConfirmationModal } from './../ConfirmationModal';

export const AdminOrphanage = ({ orphanageList, setOrphanageList, getAllOrphanages }) => {

    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [showModal, setShowModal] = useState(false);


    const [orphanageForm, setOrphanageForm] = useState(false)
    const [updateForm, setUpdateForm] = useState(false)
    const [orphanageId, setOrphanageId] = useState(null)

    const filteredOrphanageList = orphanageList.filter((orphanage) => {
        const matchesSearch = orphanage.orphanagename.toLowerCase().startsWith(searchTerm.toLowerCase());
        const matchesDistrict = selectedDistrict ? orphanage.district === selectedDistrict : true;
        console.log(selectedDistrict, orphanage.district);
        console.log(matchesDistrict);
        return matchesSearch && matchesDistrict;
    });

    const sortedOrphanageList = [...filteredOrphanageList].sort((a, b) =>
        a.orphanagename.localeCompare(b.orphanagename)
    );

    const fetchMoreData = () => {
        console.log('Fetching more data...');
    };

    const handleClickOrphanage = (orphanageId) => {
        const path = `/orphanage/${orphanageId}`;
        navigate(path);
    };

    const handleDeleteOrphanage = async (orphanageId) => {
        console.log('Inside the handle Delete orphanage...');
        try {
            console.log('try block Inside the handle Delete orphanage...');
            const children = await axiosPrivate.get(`/child/orphanage/${orphanageId}`, {
                headers: {
                    orphanageId: orphanageId
                }
            });
            console.log(orphanageId)
            console.log(children.data)
            if (children.data.childrenList.length === 0) {
                console.log("inside the tables delete");

                try {
                    // Deleting social workers related to orphanage
                    const deletedSocialWorkers = await axiosPrivate.delete(`/socialworker/${orphanageId}`);
                    console.log("frontend social workers", deletedSocialWorkers.data.deletedCount);  // Proper logging for status

                    // Deleting staff related to orphanage
                    const deletedStaff = await axiosPrivate.delete(`/staff/${orphanageId}`);
                    console.log("frontend staffs", deletedStaff.data.deletedCount);   // Optional logging

                    // Deleting orphanage itself
                    const deletedOrphanage = await axiosPrivate.delete(`/orphanage/${orphanageId}`);
                    console.log(deletedOrphanage.status);  // Optional logging

                    // Update orphanage list state
                    setOrphanageList(orphanageList.filter((orphanage) => orphanage.orphanageid !== orphanageId));
                    console.log('Deleted orphanage');
                    toast.success('Orphanage deleted successfully');

                } catch (error) {
                    console.error('Error during delete operations:', error);
                    toast.error('Failed to delete orphanage');
                }
            }
            else {
                console.log(children.data.childrenList.length)
                toast.error('Cannot delete orphanage with children');

            }

        } catch (error) {
            console.error('Failed to delete orphanage:', error);

            setOrphanageList(orphanageList);
        }
        finally {
            setShowModal(false);
        }
    };

    const handleUpdateOrphanage = (id) => {
        const path = `/orphanage/${id}/edit`;
        navigate(path);
        console.log('Navigating to Updating orphanage...');
    }



    return (
        <div >
            <h1 className='mb-5 text-4xl font-bold text-center text-gray-800'>Registered Orphanages</h1>
            <div className='flex flex-col justify-start sm:flex-row'>
                <PrimaryButton onClick={() => setOrphanageForm(true)} text={'Add Orphanage'} className={' my-auto ml-2 '} />

                <div className='m-2'>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </div>
                <div className='my-auto ml-2' >
                    <Dropdown
                        valueList={districts}
                        onSelect={(district) => {
                            setSelectedDistrict(district);
                        }}
                        className={'w-full m-0 p-0'}
                    />
                </div>
            </div>

            <style jsx>
                {`
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

            <InfiniteScroll

                className='mx-2 mb-5 infinite-scroll-container'
                dataLength={sortedOrphanageList.length}
                next={fetchMoreData}
                hasMore={true}
            >
                {sortedOrphanageList.map((item, index) => (
                    <div className='flex items-center justify-between py-2 '
                        key={index}>
                        <div className="w-full text-black bg-transparent border border-orange-900 rounded-md card">
                            <div className="card-body">
                                <h2 className="card-title">{item.orphanagename}</h2>
                                <p>Reg. No : {item.orphanageid}<br />{item.head_email}</p>
                                <div className="justify-end card-actions">
                                    <PrimaryButton
                                        text='view'
                                        color='black'
                                        onClick={() => handleClickOrphanage(item.orphanageid)} />
                                    <PrimaryButton
                                        color="blue"
                                        text='Update'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOrphanageId(item.orphanageid)
                                            setUpdateForm(true)

                                        }}
                                    />
                                    <PrimaryButton
                                        color='red'
                                        text='Delete'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOrphanageId(item.orphanageid)
                                            setShowModal(true)
                                        }} />
                                </div>
                            </div>
                        </div>

                    </div>

                ))}
            </InfiniteScroll>
            {orphanageForm && <OrphanageForm setOrphanageForm={setOrphanageForm} getAllOrphanages={getAllOrphanages} />}
            {updateForm && <UpdateOrphanage id={orphanageId} setUpdateForm={setUpdateForm} getAllOrphanages={getAllOrphanages} />}
            {showModal && <ConfirmationModal head={"Delete this Orphanage"} body={"Are you sure you want to delete this orphanage?"} setVisibility={setShowModal} handleConfirmation={() => handleDeleteOrphanage(orphanageId)} />}
        </div>
    )
}
