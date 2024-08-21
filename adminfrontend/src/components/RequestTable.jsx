import React, { useEffect, useState } from 'react'
import { ChildPreview } from './ChildPreview'

export const RequestTable = ({ requests, setVisibility, setSelectedRequest, selectedRequest }) => {
    useEffect(() => { console.log(requests) }, [requests])

    return (
        <div>
            <div
                className="rounded-sm border bg-white px-5 pb-2.5 pt-6 shadow-default mb-5 sm:px-7.5 xl:pb-1 min-h-screen"
            >
                <h4 className="mb-6 text-xl font-bold text-black ">
                    Requests
                </h4>

                <div className="flex flex-col">
                    <div className="grid grid-cols-5 rounded-sm">
                        <div className="p-2.5 text-center xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base ">Type</h5>
                        </div>
                        <div className="p-2.5 text-center xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Entity</h5>
                        </div>
                        <div className="p-2.5 text-center xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Date</h5>
                        </div>
                        <div className="p-2.5 text-center xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">Status</h5>
                        </div>
                        <div className="p-2.5 text-center xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">View</h5>
                        </div>

                    </div>
                    {requests.map((request) => (
                        <div key={request.requestid} className="grid grid-cols-5 border-b border-stroke  text-gray-500 font-medium rounded">
                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p className="hidden font-medium  sm:block"> {request.type}</p>
                            </div>

                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p className="hidden font-medium  sm:block">{request.entity}</p>
                            </div>

                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p >{new Date(request.created_at).toISOString().split('T')[0]}</p>
                            </div>

                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p className={`${request.status === 'pending' ? 'bg-blue-500' : request.status === 'approved' ? 'bg-green-500' : 'bg-red-500'} text-white rounded-full px-2`}>{request.status}</p>
                            </div>
                            <div className="m-auto">
                                <button
                                    onClick={() => {
                                        setSelectedRequest(request)
                                        setVisibility(true)
                                    }}
                                    className="px-4 py-2 leading-5 text-white transition-colors duration-200 transform bg-orange-500 rounded-md hover:bg-orange-700">
                                    view
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}
