import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import ApplicationModalAdmin from './ApplicationModalAdmin';
import Loading from '../Loading';
import PrimaryButton from '../elements/PrimaryButton';

const ApplicationListAdmin = () => {
    const axiosPrivate = useAxiosPrivate();
    const [applicationList, setApplicationList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isLoading, setIsLoading] = useState(true)

    const [selectedTab, setSelectedTab] = useState('Pending')
    const [pendingApplications, setPendingApplications] = useState([])
    const [acceptedApplications, setAcceptedApplications] = useState([])
    const [rejectedApplications, setRejectedApplications] = useState([])

    useEffect(() => {
        const getAllApplications = async () => {
            try {
                const response = await axiosPrivate.get(`/application`);
                const reverseApplicationList = response.data.applicationList
                setApplicationList(reverseApplicationList.reverse())
                setPendingApplications(response.data.applicationList.filter(application => application.status === 'Pending').reverse());
                setAcceptedApplications(response.data.applicationList.filter(application => application.status === 'Accepted').reverse());
                setRejectedApplications(response.data.applicationList.filter(application => application.status === 'Rejected').reverse());

            } catch (error) {
                console.error('Failed to fetch applications:', error);
            }

            setIsLoading(false);
        };
        getAllApplications();
    }, [axiosPrivate]);


    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto'; // Ensure body overflow is reset on unmount
        };
    }, [showModal]);

    const handleOpenModal = (application) => {
        setSelectedApplication(application);
        setShowModal(true);
    };

    return (
        <div>
            {isLoading ? (<Loading />) :
                <div className="overflow-x-auto px-2">
                    <h1 className='text-4xl font-bold text-center text-gray-800'>Adoption Applications</h1>
                    <div role="tablist" className="tabs tabs-lifted w-fit my-5">
                        <a role="tab" onClick={() => setSelectedTab('Pending')} className={`tab ${selectedTab == 'Pending' && 'tab-active text-yellow-600'}  text-xl`}>Pending</a>
                        <a role="tab" onClick={() => setSelectedTab('Accepted')} className={`tab ${selectedTab == 'Accepted' && 'tab-active text-green-600'}  text-xl`}>Accepted</a>
                        <a role="tab" onClick={() => setSelectedTab('Rejected')} className={`tab ${selectedTab == 'Rejected' && 'tab-active text-red-600'}  text-xl`}>Rejected</a>
                    </div>


                    {selectedTab == 'Pending' && pendingApplications.map((application) => (
                        <div
                            key={application.id}
                            className="py-2">

                            <div className="card bg-transparent border border-orange-900 rounded-md text-black w-full">
                                <div className="card-body">
                                    <h2 className="card-title">Applicant : {application.firstname} {application.lastname}</h2>
                                    <p>status :
                                        <span
                                            className='bg-yellow-600 indicator-item indicator-middle indicator-center badge text-white mx-1'>{application.status}
                                        </span></p>
                                    <p>date : {application.createdat.split('T')[0]}</p>

                                    <div className="card-actions justify-end">
                                        <PrimaryButton
                                            text='view'
                                            onClick={() => { handleOpenModal(application) }} />
                                    </div>
                                </div>
                            </div>
                        </div>))}

                    {selectedTab == 'Accepted' && acceptedApplications.map((application) => (
                        <div
                            key={application.id}
                            className="py-2">

                            <div className="card bg-transparent border border-orange-900 rounded-md text-black w-full">
                                <div className="card-body">
                                    <h2 className="card-title">Applicant :  {application.firstname} {application.lastname}</h2>
                                    <p>status :
                                        <span
                                            className='bg-green-600 indicator-item indicator-middle indicator-center badge text-white mx-1'>{application.status}
                                        </span></p>
                                    <p>date : {application.createdat.split('T')[0]}</p>

                                    <div className="card-actions justify-end">
                                        <PrimaryButton
                                            text='view'
                                            onClick={() => { handleOpenModal(application) }} />
                                    </div>
                                </div>
                            </div>
                        </div>))}
                    {selectedTab == 'Rejected' && rejectedApplications.map((application) => (
                        <div
                            key={application.id}
                            className="py-2">

                            <div className="card bg-transparent border border-orange-900 rounded-md text-black w-full">
                                <div className="card-body">
                                    <h2 className="card-title">Applicant :  {application.firstname} {application.lastname}</h2>
                                    <p>status :
                                        <span
                                            className='bg-red-600 indicator-item indicator-middle indicator-center badge text-white mx-1'>{application.status}
                                        </span></p>
                                    <p>date : {application.createdat.split('T')[0]}</p>
                                    <div className="card-actions justify-end">
                                        <PrimaryButton
                                            text='view'
                                            onClick={() => { handleOpenModal(application) }} />
                                    </div>
                                </div>
                            </div>
                        </div>))}

                </div>}


            {showModal && selectedApplication && (
                <ApplicationModalAdmin
                    application={selectedApplication}
                    closeModal={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default ApplicationListAdmin;
