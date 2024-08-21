import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useEffect, useState } from 'react'
import { ConfirmationModal } from './ConfirmationModal'
import toast from 'react-hot-toast';

export const ChildPreview = ({ requests, setRequests, setVisibility, requestId }) => {
    const [child, setChild] = useState({})
    const [imageURL, setImageURL] = useState('')
    const [confirmModalVisibility, setConfirmModalVisibility] = useState(false)
    const axiosPrivate = useAxiosPrivate()
    const [res, setRes] = useState('')
    const [request, setRequest] = useState({})
    const [pageLoading, setPageLoading] = useState(true)

    console.log(requestId)

    const handleResponse = async (response) => {

        try {
            let data
            let updatedRequest
            switch (request.type) {
                case 'create':
                    data = await axiosPrivate.put('/request/addChild', {
                        requestid: requestId,
                        response: response
                    })
                    updatedRequest = data.data.data
                    console.log(updatedRequest)
                    setRequests(requests.filter(request => request.requestid !== requestId).concat(updatedRequest))
                    break;
                case 'update':
                    data = await axiosPrivate.put('/request/editChild', {
                        requestid: requestId,
                        response: response
                    })
                    updatedRequest = data.data.data
                    setRequests(requests.filter(request => request.requestid !== requestId).concat(updatedRequest))
                    break;
                case 'delete':
                    data = await axiosPrivate.put('/request/deleteChild', {
                        requestid: requestId,
                        response: response
                    })
                    updatedRequest = data.data.data
                    setRequests(requests.filter(request => request.requestid !== requestId).concat(updatedRequest))
                    break;
                default:
                    break;
            }

            toast.success(`Request ${response} successfully`)
        }
        catch (error) {
            toast.error(error.response.data)
        } finally {
            setVisibility(false)
        }
    }

    useEffect(() => {
        const getRequestData = async () => {
            try {
                const response = await axiosPrivate.get(`/request/get/${requestId}`)
                setChild(response.data.request.request)
                setRequest(response.data.request)
                setImageURL(`https://avatar.iran.liara.run/public/${response.data.request.request.gender === 'Male' ? 'boy' : 'girl'}?username=${response.data.request.request.name.split(' ').join('')}`)
            }
            catch (error) {
                console.error('Failed to fetch child:', error)
            }
        }
        getRequestData()
        setPageLoading(false)
    }, [])

    return (

        <div className="fixed inset-0 flex  justify-center bg-black bg-opacity-50 overflow-auto px-10 z-10">
            <section className=" px-8 py-4 mx-auto bg-white rounded-md shadow-md my-5 max-w-3xl">

                <div className="flex justify-between items-center mb-3">
                    <h1 className="text-lg font-bold text-gray-700 capitalize flex"> {request.type} profile Request </h1>
                    <button className="px-2 py-1 bg-red-500 text-white rounded-md" onClick={() => setVisibility(false)}>Close</button>
                </div>
                <div className="overflow-y-auto max-h-[80vh]">

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                        <img className="w-64 my-auto p-10 rounded-full md:rounded-full mx-auto col-span-1 sm:col-span-4" src={imageURL} alt="ERROR" />
                        <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                            <label className="text-gray-700" htmlFor="name">Name of the child </label>
                            <label id="name" type="text" className="block w-80 px-3 py-1 mt-1 text-gray-700 bg-white border " >{child.name}</label>
                        </div>
                        <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                            <label className="text-gray-700" htmlFor="name">Date of birth</label>
                            <label id="name" type="text" className="block w-80 px-3 py-1 mt-1 text-gray-700 bg-white border " >{child.date_of_birth}</label>
                        </div>
                        <div className="col-span-1">
                            <label className="text-gray-700" htmlFor="gender">Gender</label>
                            <label id="name" type="text" className="block w-30 px-3 py-1 mt-1 text-gray-700 bg-white border " >{child.gender}</label>
                        </div>
                        <div className="col-span-1">
                            <label className="text-gray-700" htmlFor="nationality">Nationality </label>
                            <label id="name" type="text" className="block w-30 px-3 py-1 mt-1 text-gray-700 bg-white border " >{child.nationality}</label>
                        </div>
                        <div className="col-span-1 sm:col-span-2 ">
                            <label className="text-gray-700" htmlFor="religion">Religion </label>
                            <label id="name" type="text" className="block w-80 px-3 py-1 mt-1 text-gray-700 bg-white border " >{child.religion}</label>
                        </div>
                        <div className="col-span-1 sm:col-span-2 ">
                            <label className="text-gray-700" htmlFor="medicaldetails">Medical Details</label>
                            <label id="name" type="text" className="block w-80 min-h-20 px-3 py-1 mt-1 text-gray-700 bg-white border " >{child.medicaldetails}</label>
                        </div>
                        <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                            <label className="text-gray-700" htmlFor="educationaldetails">Educational Details</label>
                            <label id="name" type="text" className="block w-80 min-h-20 px-3 py-1 mt-1 text-gray-700 bg-white border " >{child.educationaldetails}</label>
                        </div>

                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={() => {
                                setRes('approved')
                                setConfirmModalVisibility(true)
                            }}
                            className="mx-4 px-4 py-2 leading-5 text-white transition-colors duration-200 transform bg-orange-500 rounded-md hover:bg-orange-700 disabled:bg-orange-300">
                            Approve
                        </button>
                        <button
                            onClick={() => {
                                setRes('rejected')
                                setConfirmModalVisibility(true)
                            }}
                            className="mx-4 px-4 py-2 leading-5 text-white transition-colors duration-200 transform bg-orange-500 rounded-md hover:bg-orange-700 disabled:bg-orange-300">
                            Reject
                        </button>
                    </div>

                </div>
            </section>

            {confirmModalVisibility &&
                <ConfirmationModal
                    head="Are you sure?" body={`Are you sure you want to ${res === 'approved' ? 'approve' : 'reject'} this request?`}
                    setVisibility={setConfirmModalVisibility}
                    handleConfirmation={() => {
                        handleResponse(res)
                        setConfirmModalVisibility(false)
                    }}
                />}
        </div >
    )
}
