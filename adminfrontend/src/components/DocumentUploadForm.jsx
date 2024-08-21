import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import toast from 'react-hot-toast';
import { ConfirmationModal } from './ConfirmationModal';

const DocumentUploadForm = ({ setUploadVisibility }) => {
    const axiosPrivate = useAxiosPrivate()
    const [confirmModelVisibility, setConfirmModelVisibility] = useState(false);


    return (
        <div className="fixed inset-0 flex  justify-center bg-black bg-opacity-50 overflow-auto px-10 z-10">
            <section className=" px-8 py-4 mx-auto bg-white rounded-md shadow-md my-5 w-2/3 h-fit">

                <div className="flex justify-between items-center my-4">
                    <h1 className="text-lg font-bold text-gray-700 capitalize flex"> Upload Document </h1>
                    <button className="px-2 py-1 bg-red-500 text-white rounded-md" onClick={() => setUploadVisibility(false)}>Close</button>
                </div>
                <div className="overflow-y-auto max-h-[80vh]">
                    <form >
                        <div className="space-y-8 font-[sans-serif] mx-auto">
                            <input type="file"
                                accept=".pdf"
                                class="w-full text-gray-500 font-medium text-sm bg-gray-100 file:cursor-pointer cursor-pointer file:border-0 file:py-2 file:px-4 file:mr-4 file:bg-gray-800 file:hover:bg-gray-700 file:text-white rounded " />
                        </div>
                        <div className="mt-4">
                            <label className="text-gray-700" htmlFor="name">Category</label>
                            <select className="block w-full px-3 py-1 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-orange-500 focus:outline-none">
                                <option>medical</option>
                                <option>educational</option>
                                <option>legal</option>
                            </select>
                        </div>
                        <div className="my-4">
                            <label className="text-gray-700" htmlFor="name">Type</label>
                            <select className="block w-full px-3 py-1 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-orange-500 focus:outline-none">

                                <option>Birth Certificate</option>
                                <option>Medical Record</option>
                                <option>Custody Report</option>
                            </select>
                        </div>

                        <div className="flex justify-end my-6">
                            <button
                                disabled={false}
                                className="px-4 py-2 leading-5 text-gray-700 transition-colors duration-200 transform bg-orange-500 rounded-md hover:bg-orange-700 disabled:bg-orange-300">Submit</button>
                        </div>
                    </form>
                </div>
            </section>

            {confirmModelVisibility && <ConfirmationModal head='Child Update Request' body='Are you sure you want to create a update child request' handleConfirmation={() => null} setVisibility={setConfirmModelVisibility} />}
        </div >
    )
}

export default DocumentUploadForm