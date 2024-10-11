import React, { useEffect, useState } from 'react'
import { ChildPreview } from './ChildPreview'
import { PDFView } from './PDFView'
import toast from 'react-hot-toast'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import PrimaryButton from './elements/PrimaryButton'
import Badge from './elements/Badge'

export const RequestTable = ({ requests, setChildVisibility, setSelectedRequest, selectedRequest, setFileVisibility, role }) => {

    useEffect(() => {
        setPendingRequests(requests.filter(request => request.status === 'pending').sort((a, b) => { return new Date(b.created_at) - new Date(a.created_at); }))
        setApprovedRequests(requests.filter(request => request.status === 'approved').sort((a, b) => { return new Date(b.created_at) - new Date(a.created_at); }))
        setRejectedRequests(requests.filter(request => request.status === 'rejected').sort((a, b) => { return new Date(b.created_at) - new Date(a.created_at); }))
    }, [requests])

    const axiosPrivate = useAxiosPrivate()

    const handleClick = async (request) => {
        await setSelectedRequest(request)
        switch (request.entity) {
            case 'child':
                setChildVisibility(true)
                break;
            case 'document':
                setFileVisibility(true)
                break;
            default:
                break;
        }
    }

    const [pendingRequests, setPendingRequests] = useState([])
    const [approvedRequests, setApprovedRequests] = useState([])
    const [rejectedRequests, setRejectedRequests] = useState([])

    const [selectedTab, setSelectedTab] = useState('Pending')

    console.log(approvedRequests)

    return (
        <div className="overflow-x-auto px-2">
            <h1 className='text-4xl font-bold text-center text-gray-800'>Child Profile Requests</h1>
            <div role="tablist" className="tabs tabs-lifted w-fit my-5">
                <a role="tab" onClick={() => setSelectedTab('Pending')} className={`tab ${selectedTab == 'Pending' && 'tab-active text-yellow-600'}  text-xl`}>Pending</a>
                <a role="tab" onClick={() => setSelectedTab('Accepted')} className={`tab ${selectedTab == 'Accepted' && 'tab-active text-green-600'}  text-xl`}>Approved</a>
                <a role="tab" onClick={() => setSelectedTab('Rejected')} className={`tab ${selectedTab == 'Rejected' && 'tab-active text-red-600'}  text-xl`}>Rejected</a>
            </div>

            <div >

                {selectedTab == 'Pending' && pendingRequests.map((request, index) => (
                    <div
                        key={index}
                        className="py-2">

                        <div className="card bg-transparent border border-orange-900 rounded-md text-black w-full">
                            <div className="card-body">
                                <h2 className="card-title">{request.type.toUpperCase() + " " + request.entity} </h2>
                                <p>status :
                                    <span
                                        className='bg-yellow-600 indicator-item indicator-middle indicator-center badge text-white mx-1'>{request.status}
                                    </span></p>

                                <p >created at : {request.created_at.split('T')[0]}</p>
                                <div className="card-actions justify-end">
                                    <PrimaryButton
                                        text='view'
                                        onClick={() => handleClick(request)} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {selectedTab == 'Accepted' && approvedRequests.map((request, index) => (
                    <div
                        key={index}
                        className="py-2">

                        <div className="card bg-transparent border border-orange-900 rounded-md text-black w-full">
                            <div className="card-body">
                                <h2 className="card-title"> {request.type.toUpperCase() + " " + request.entity} </h2>
                                <p>status :
                                    <span
                                        className='bg-green-600 indicator-item indicator-middle indicator-center badge text-white mx-1'>{request.status}
                                    </span></p>
                                <p >created at : {request.created_at.split('T')[0]}</p>

                                <div className="card-actions justify-end">
                                    <PrimaryButton
                                        text='view'
                                        onClick={() => handleClick(request)} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {selectedTab == 'Rejected' && rejectedRequests.map((request, index) => (
                    <div
                        key={index}
                        className="py-2">

                        <div className="card bg-transparent border border-orange-900 rounded-md text-black w-full">
                            <div className="card-body">
                                <h2 className="card-title">{request.type.toUpperCase() + " " + request.entity} </h2>
                                <p>status :
                                    <span
                                        className='bg-red-600 indicator-item indicator-middle indicator-center badge text-white mx-1'>{request.status}
                                    </span></p>
                                <p >created at : {request.created_at.split('T')[0]}</p>
                                <div className="card-actions justify-end">
                                    <PrimaryButton
                                        text='view'
                                        onClick={() => handleClick(request)} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}


            </div>
        </div>

    )
}
