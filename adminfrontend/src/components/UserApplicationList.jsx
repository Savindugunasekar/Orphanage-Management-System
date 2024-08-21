import React, { useState, useEffect } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'
import ApplicationModal from './ApplicationModal' // Make sure to import the ApplicationModal component
import { UserApplicationModal } from './UserApplicationModal'

const UserApplicationList = () => {
    const { auth } = useAuth()
    const axiosPrivate = useAxiosPrivate()
    const [applicationList, setApplicationList] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [selectedApplication, setSelectedApplication] = useState(null)

    useEffect(() => {
        const getAllApplications = async () => {
            try {
                const response = await axiosPrivate.get('/application')
                const filteredApplicationList = response.data.applicationList.filter((application) => application.userid === auth.userId )
                setApplicationList(filteredApplicationList)
            } catch (error) {
                console.error('Failed to fetch applications:', error)
            }
        }
        getAllApplications()
    }, [axiosPrivate, auth.userId])

    const handleOpenModal = (application) => {
        setSelectedApplication(application)
        setShowModal(true)
    }

    return (
        <div>
            <div className=" px-10 ">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {applicationList.map((application) => (
        <div
            key={application.applicationid}
            onClick={application.status === 'Accepted' ? () => handleOpenModal(application) : null}
            className="p-4 bg-white shadow-lg rounded-lg cursor-pointer hover:bg-gray-100"
        >
            <p className="text-gray-500">{new Date(application.createdat).toLocaleDateString()}</p>
            <p
                className={`mt-2 text-lg font-semibold ${
                    application.status === 'Accepted'
                        ? 'text-green-500'
                        : application.status === 'Rejected'
                        ? 'text-red-500'
                        : 'text-yellow-500'
                }`}
            >
                {application.status}
            </p>
        </div>
    ))}
</div>

            </div>
            {showModal && selectedApplication && (
                <UserApplicationModal
                    application={selectedApplication}
                    closeModal={() => setShowModal(false)}
                />
            )}
        </div>
    )
}

export default UserApplicationList
