import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import ApplicationModalAdmin from './ApplicationModalAdmin';

const ApplicationListAdmin = () => {
    const axiosPrivate = useAxiosPrivate();
    const [applicationList, setApplicationList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);

    useEffect(() => {
        const getAllApplications = async () => {
            try {
                const response = await axiosPrivate.get(`/application`);
                setApplicationList(response.data.applicationList);
            } catch (error) {
                console.error('Failed to fetch applications:', error);
            }
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
            <div className="overflow-x-auto px-10">
                <table className="min-w-full bg-white border-b text-center">
                    <thead className='text-primary'>
                        <tr>
                            <th className="py-2 px-4 border-b">Applicant Name</th>
                            <th className="py-2 px-4 border-b">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applicationList.map((application) => (
                            <tr
                                key={application.id}
                                onClick={application.status === 'Pending' ? () => handleOpenModal(application) : null}
                                className="cursor-pointer hover:bg-gray-100"
                            >
                                <td className="py-3 px-4 border-b">{application.username}</td>
                                <td
                                    className={`py-3 px-4 border-b ${
                                        application.status === 'Accepted'
                                            ? 'text-green-500'
                                            : application.status === 'Rejected'
                                            ? 'text-red-500'
                                            : 'text-yellow-500'
                                    }`}
                                >
                                    {application.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
