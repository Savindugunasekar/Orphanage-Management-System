import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import ApplicationModal from './ApplicationModal'
import Loading from './Loading'
import PrimaryButton from './elements/PrimaryButton'

const ApplicationList = () => {
    const { id } = useParams()
    const axiosPrivate = useAxiosPrivate()
    const [applicationList, setApplicationList] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [selectedApplication, setSelectedApplication] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [socialWorkersList, setSocialWorkersList] = useState([])
    const [selectedTab, setSelectedTab] = useState('Pending')
    const [pendingApplications, setPendingApplications] = useState([])
    const [acceptedApplications, setAcceptedApplications] = useState([])

    useEffect(() => {
        const getApprovedApplications = async () => {
            try {
                const response = await axiosPrivate.get(`/application/approve?orphanageid=${id}`)
                setApplicationList(response.data.approvedList)
                setPendingApplications(response.data.approvedList.filter(application => application.status === 'Pending').reverse());
                setAcceptedApplications(response.data.approvedList.filter(application => application.status === 'Accepted').reverse());
                console.log(response.data.approvedList)
            } catch (error) {
                console.error('Failed to fetch applications:', error)
            }
        }

        const getAllSocialWorkers = async () => {
            try {
                const response = await axiosPrivate.get(`/socialworker/all?orphanageid=${id}`)
                setSocialWorkersList(response.data.socialWorkerList)
            } catch (error) {
                console.error('Failed to fetch social workers:', error)
            }
            setIsLoading(false)
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
            {isLoading ? (<Loading />) : (



                <div className="overflow-x-auto px-2">
                    <h1 className='text-4xl font-bold text-center text-gray-800'>Adoption Applications</h1>
                    <div role="tablist" className="tabs tabs-lifted w-fit my-5">
                        <a role="tab" onClick={() => setSelectedTab('Pending')} className={`tab ${selectedTab == 'Pending' && 'tab-active text-yellow-600'}  text-xl`}>Pending</a>
                        <a role="tab" onClick={() => setSelectedTab('Accepted')} className={`tab ${selectedTab == 'Accepted' && 'tab-active text-green-600'}  text-xl`}>Accepted</a>
                    </div>


                    {selectedTab == 'Pending' && pendingApplications.map((item, index) => (
                        <div
                            key={index}
                            className="py-2">

                            <div className="card bg-transparent border border-orange-900 rounded-md text-black w-full">
                                <div className="card-body">
                                    <h2 className="card-title">Applicant : {item.application.firstname} {item.application.lastname}</h2>
                                    <p>status :
                                        <span
                                            className='bg-yellow-600 indicator-item indicator-middle indicator-center badge text-white mx-1'>{item.application.status}
                                        </span></p>
                                    <span>Date : {item.application.createdat.split('T')[0]}</span>
                                    <span>Child : {item.child.name}</span>
                                    <div className="card-actions justify-end">
                                        <PrimaryButton
                                            text='view'
                                            onClick={() => { handleOpenModal(item) }} />
                                    </div>
                                </div>
                            </div>
                        </div>))}

                    {selectedTab == 'Accepted' && acceptedApplications.map((item, index) => (
                        <div
                            key={index}
                            className="py-2">

                            <div className="card bg-transparent border border-orange-900 rounded-md text-black w-full">
                                <div className="card-body">
                                    <h2 className="card-title">Applicant : {item.application.firstname} {item.application.lastname}</h2>
                                    <p>status :
                                        <span
                                            className='bg-green-600 indicator-item indicator-middle indicator-center badge text-white mx-1'>{item.application.status}
                                        </span></p>
                                    <span>Date : {item.application.createdat.split('T')[0]}</span>
                                    <span>Child : {item.child.name}</span>
                                    <div className="card-actions justify-end">
                                        <PrimaryButton
                                            text='view'
                                            onClick={() => { handleOpenModal(item) }} />
                                    </div>
                                </div>
                            </div>
                        </div>))}
                </div>

            )}

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
