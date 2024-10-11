import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AvatarPlaceHolder from '../assets/images/avatar_placeholder.png'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { FaArrowCircleLeft } from "react-icons/fa";

export const ChildPreview = ({ child, setPreviewVisibility, setFileVisibility }) => {

    const [imageURL, setImageURL] = useState(null);
    const axiosPrivate = useAxiosPrivate();

    const getPhotoURL = async (childId) => {
        try {
            const response = await axiosPrivate.get(`/file/childPhotoDownload/${childId}`);
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

    useEffect(() => {
        getPhotoURL(child.childid)
    }, [])

    return (

        <div className="fixed inset-0 flex  justify-center backdrop-blur-md drop-shadow-lg border  px-10 z-10">
            <section className=" px-8 py-4 mx-auto bg-white rounded-md shadow-md my-5 max-w-3xl">

                <div className="flex justify-between items-center mb-3">
                    <h1 className="text-lg font-bold text-gray-700 capitalize flex"> {child.name}  </h1>
                    {/* close button */}
                    <div className='flex flex-row justify-end my-auto ml-5'>
                        <FaArrowCircleLeft
                            onClick={() => {
                                setFileVisibility(true)
                                setPreviewVisibility(false)
                            }}
                            className='bg-red-500 rounded-full text-4xl p-2 text-white drop-shadow hover:bg-red-700' />
                    </div>
                </div>


                <div className="overflow-y-auto max-h-[80vh] w-fit">

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                        <img className="w-64 my-auto p-10 rounded-full md:rounded-full mx-auto col-span-1 sm:col-span-4" src={imageURL ? imageURL : AvatarPlaceHolder} alt="ERROR" />
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
                </div>
            </section>
        </div >
    )
}
