import React, { useEffect, useState } from 'react';
import { AssignModal } from '../AssignModal'
import toast from 'react-hot-toast'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import PrimaryButton from '../elements/PrimaryButton';

export const AdminAssign = ({ orphanageList }) => {

    const axiosPrivate = useAxiosPrivate()
    const [showModal, setShowModal] = useState(false)
    const [selectedAssign, setSelectedAssign] = useState("")
    const [socialWorkerList, setSocialWorkerList] = useState([]);
    const [staffList, setStaffList] = useState([]);

    const [selectedTab, setSelectedTab] = useState('Staff')

    const getAllStaff = async () => {
        try {
            const response = await axiosPrivate.get(`/staff/all`);
            setStaffList(response.data.staffList);
        } catch (error) {
            console.error('Failed to fetch staff:', error);
        }
    };

    const getAllSocialWorkers = async () => {
        try {
            const response = await axiosPrivate.get(`/socialworker/overview`);
            setSocialWorkerList(response.data.socialWorkerList);
        } catch (error) {
            console.error('Failed to fetch social workers:', error);
        }
    };

    useEffect(() => {
        getAllStaff()
        getAllSocialWorkers()
    }, [])


    const handleAssign = async (data) => {
        try {
            let response;
            if (selectedAssign === 'socialworker') {
                response = await axiosPrivate.post('/socialworker', data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                await getAllSocialWorkers()
            } else if (selectedAssign === 'staff') {
                response = await axiosPrivate.post('/staff', data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                await getAllStaff()
            }
            toast.success('Assigned successfully');
            console.log('assigned successfully');
            setSelectedAssign('')

        } catch (error) {

            toast.error('Failed to assign');
            console.log(error);
        }
    }
    return (
        <div className='mx-2'>

            <h1 className='text-4xl font-bold text-center text-gray-800'>Staff Management</h1>
            <div role="tablist" className="tabs tabs-lifted w-fit my-5">
                <a role="tab" onClick={() => setSelectedTab('Staff')} className={`tab ${selectedTab == 'Staff' && 'tab-active text-yellow-600'}  text-xl`}>Staff</a>
                <a role="tab" onClick={() => setSelectedTab('Social')} className={`tab ${selectedTab == 'Social' && 'tab-active text-green-600'}  text-xl`}>Social Workers</a>
            </div>

            {selectedTab == 'Staff' &&
                <div>
                    <PrimaryButton
                        onClick={() => {
                            setShowModal(true)
                            setSelectedAssign('staff')
                        }}
                        text={'Assign Staff Member'}
                        className={'my-5'} />

                    <div className="  mx-auto card bg-base-100 w-full shadow-xl rounded-lg overflow-auto mb-10 p-5 ">
                        <h1 className='text-2xl text-center my-5'>Social Workers</h1>
                        <table className="table table-zebra">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Username</th>
                                    <th>Tel. No.</th>
                                    <th>Email</th>
                                    <th>Orphanage</th>
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
                                            <td>{sw.orphanage}</td>
                                        </tr>
                                    ))
                                ) : (
                                    // Render a single row with a colspan to show the 'No social workers found' message
                                    <tr>
                                        <td colSpan="4" className="text-center">No social worker found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                    </div>

                </div>}


            {selectedTab == 'Social' && <div>
                <PrimaryButton
                    onClick={() => {
                        setShowModal(true)
                        setSelectedAssign('socialworker')
                    }}
                    text={'Assign social worker'}
                    className={'my-5'}
                />

                <div className="  mx-auto card bg-base-100 w-full shadow-xl rounded-lg overflow-auto mb-10 p-5 ">
                    <h1 className='text-2xl text-center my-5'>Social Workers</h1>
                    <table className="table table-zebra">
                        {/* head */}
                        <thead>
                            <tr>
                                <th></th>
                                <th>Username</th>
                                <th>Tel. No.</th>
                                <th>Email</th>
                                <th>Orphanage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Check if there are social workers in the list */}
                            {socialWorkerList.length > 0 ? (
                                socialWorkerList.map((sw, index) => (
                                    <tr key={index}>
                                        <th>{index + 1}</th>
                                        <td>{sw.username}</td>
                                        <td>{sw.telno}</td>
                                        <td>{sw.email}</td>
                                        <td>{sw.orphanage}</td>
                                    </tr>
                                ))
                            ) : (
                                // Render a single row with a colspan to show the 'No social workers found' message
                                <tr>
                                    <td colSpan="4" className="text-center">No social worker found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                </div>
            </div>
            }
            <AssignModal
                showModal={showModal}
                type={selectedAssign}
                closeModal={() => {
                    setSelectedAssign('')
                    setShowModal(false)
                }}
                orphanageList={orphanageList}
                onSubmit={handleAssign}
            />
        </div>
    )
}
