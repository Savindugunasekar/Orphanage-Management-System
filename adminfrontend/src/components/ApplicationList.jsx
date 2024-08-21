import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import ApplicationModal from './ApplicationModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ApplicationList = () => {
    const { id } = useParams()
    const axiosPrivate = useAxiosPrivate()
    const [applicationList, setApplicationList] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [selectedApplication, setSelectedApplication] = useState(null)
    const [socialWorkersList, setSocialWorkersList] = useState([])

    useEffect(() => {
        const getApprovedApplications = async () => {
            try {
                const response = await axiosPrivate.get(`/application/approve?orphanageid=${id}`)
                setApplicationList(response.data.approvedList)
            } catch (error) {
                console.error('Failed to fetch applications:', error)
            }
        }

        const getAllSocialWorkers = async () => {
            try {
                const response = await axiosPrivate.get(`/socialworker/all?orphanageid=${id}`)
                setSocialWorkersList(response.data.socialWorkerList)
            } catch (error) {
                console.error('Failed to fetch socialworkers:', error)
            }
        }

        getApprovedApplications()
        getAllSocialWorkers()
    }, [axiosPrivate, id])

    const handleOpenModal = (item) => {
        setSelectedApplication(item)
        setShowModal(true)
    }

    return (
        <div>
            <div className="overflow-x-auto px-10">
                <table className="min-w-full bg-white border-b text-center">
                    <thead className='text-primary'>
                        <tr>
                            <th className="py-2 px-4 border-b">Child</th>
                            <th className="py-2 px-4 border-b">Applicant Name</th>
                            <th className="py-2 px-4 border-b">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applicationList.map((item) => (
                            <tr
                                key={item.application.applicationid}
                                onClick={item.application.status === 'Accepted' ? () => handleOpenModal(item) : null}
                                className="cursor-pointer hover:bg-gray-100"
                            >
                                <td className="py-3 px-4 border-b">{item.child.name}</td>
                                <td className="py-3 px-4 border-b">{item.application.username}</td>
                                <td
                                    className={`py-3 px-4 border-b ${
                                        item.application.status === 'Accepted'
                                            ? 'text-green-500'
                                            : item.application.status === 'Rejected'
                                            ? 'text-red-500'
                                            : 'text-yellow-500'
                                    }`}
                                >
                                    {item.application.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && selectedApplication && (
                <ApplicationModal
                    application={selectedApplication}
                    socialWorkerList={socialWorkersList}
                    closeModal={() => setShowModal(false)}
                />
            )}
        </div>
    )
}

export default ApplicationList
