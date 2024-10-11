import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useEffect, useState } from 'react'
import { ConfirmationModal } from './ConfirmationModal'
import toast from 'react-hot-toast';
import AvatarPlaceHolder from '../assets/images/avatar_placeholder.png'
import Loading from './Loading';
import PrimaryButton from './elements/PrimaryButton';
import { RiCloseLargeFill } from 'react-icons/ri';

export const ChildRequest = ({ requests, setRequests, setChildVisibility, requestId, role }) => {
    const [child, setChild] = useState({})
    const [imageURL, setImageURL] = useState(AvatarPlaceHolder)
    const [confirmModalVisibility, setConfirmModalVisibility] = useState(false)
    const axiosPrivate = useAxiosPrivate()
    const [res, setRes] = useState('')
    const [request, setRequest] = useState({})
    const [pageLoading, setPageLoading] = useState(true)
    const [loading, setLoading] = useState(false)

    const getPhotoURL = async () => {
        try {
            const response = await axiosPrivate.get(`/file/requestPhotoDownload/${requestId}`);
            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            if (response.data.URL) {
                setImageURL(response.data.URL)
            }
        } catch (error) {
            console.error('Failed to fetch photo:', error)
        }
    }

    const handleResponse = async (response) => {
        try {
            setLoading(true)
            let data
            let updatedRequest
            switch (request.type) {
                case 'create':
                    data = await axiosPrivate.put('/request/addChild', {
                        requestid: requestId,
                        response: response
                    })
                    if (data.data.success === true) {
                        updatedRequest = data.data.data
                        setRequests(requests.filter(request => request.requestid !== requestId).concat(updatedRequest))
                    }
                    break;
                case 'update':
                    data = await axiosPrivate.put('/request/editChild', {
                        requestid: requestId,
                        response: response
                    })
                    console.log(data.data.success)
                    if (data.data.success === true) {
                        updatedRequest = data.data.data
                        setRequests(requests.filter(request => request.requestid !== requestId).concat(updatedRequest))
                    }
                    break;
                case 'delete':
                    data = await axiosPrivate.put('/request/deleteChild', {
                        requestid: requestId,
                        response: response
                    })
                    console.log(data.data.success)
                    if (data.data.success === true) {
                        updatedRequest = data.data.data
                        setRequests(requests.filter(request => request.requestid !== requestId).concat(updatedRequest))
                    }
                    break;
                default:
                    break;
            }
            setLoading(false)

            toast.success(`Request ${response} successfully`)
        }
        catch (error) {
            toast.error(error.response.data)
        } finally {
            setChildVisibility(false)
        }
    }

    useEffect(() => {
        setPageLoading(true)
        const getRequestData = async () => {
            try {
                const response = await axiosPrivate.get(`/request/get/${requestId}`)
                console.log(response.data.data)
                setChild(response.data.data)
                setRequest(response.data.request)
            }
            catch (error) {
                console.error('Failed to fetch child:', error)
            }
        }
        getRequestData()
        getPhotoURL()
        setPageLoading(false)
    }, [])

    return (

        <div className="fixed inset-0 flex  justify-center backdrop-blur-md drop-shadow-lg border px-10 z-10">
            <section className=" px-8 py-4 mx-auto bg-white rounded-md shadow-md my-5 max-w-3xl">

                {pageLoading ? <Loading /> :
                    <>
                        <div className="flex justify-between items-center mb-3">
                            <h1 className="text-lg font-bold text-gray-700 capitalize flex"> {request.type} profile Request </h1>
                            {/* close button */}
                            <div className='flex flex-row justify-end my-auto ml-5'>
                                <RiCloseLargeFill
                                    onClick={() => setChildVisibility(false)}
                                    className='bg-red-500 rounded-full text-4xl p-2 text-white drop-shadow hover:bg-red-700' />
                            </div>
                        </div>

                        <div className="overflow-y-auto max-h-[80vh] w-fit">

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 w-fit">
                                <img className="w-64 h-64 my-auto p-10 rounded-full md:rounded-full mx-auto col-span-1 sm:col-span-4" src={imageURL} alt="ERROR" />
                                <div className="col-span-1 sm:col-span-2">
                                    <label className="text-gray-700" htmlFor="name">Name of the child </label>
                                    <label id="name" type="text" className="block w-80 px-3 py-1 mt-1 text-gray-700 bg-white border " >{child.name}</label>
                                </div>
                                <div className="col-span-1 sm:col-span-2 ">
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
                                <div className="col-span-1 sm:col-span-2 ">
                                    <label className="text-gray-700" htmlFor="educationaldetails">Educational Details</label>
                                    <label id="name" type="text" className="block w-80 min-h-20 px-3 py-1 mt-1 text-gray-700 bg-white border " >{child.educationaldetails}</label>
                                </div>

                            </div>
                            <div className="flex justify-end mt-4">
                                <PrimaryButton
                                    onClick={() => {
                                        setRes('approved')
                                        setConfirmModalVisibility(true)
                                    }}
                                    text={'Approve'}
                                    disabled={request.status != 'pending' || !child || role != 'Head'}
                                    className={'mx-2'}
                                    loading={loading} />
                                <PrimaryButton
                                    onClick={() => {
                                        setRes('rejected')
                                        setConfirmModalVisibility(true)
                                    }}
                                    text={'Reject'}
                                    disabled={request.status != 'pending' || !child || role != 'Head'}
                                    className={'mx-2'}
                                    loading={loading} />
                            </div>

                        </div></>}
            </section>

            {confirmModalVisibility &&
                <ConfirmationModal
                    head="Are you sure?"
                    body={`Are you sure you want to ${res === 'approved' ? 'approve' : 'reject'} this request?`}
                    setVisibility={setConfirmModalVisibility}
                    handleConfirmation={() => {
                        handleResponse(res)
                        setConfirmModalVisibility(false)
                    }}
                />}
        </div >
    )
}
