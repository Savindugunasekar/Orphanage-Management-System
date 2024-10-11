import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { PDFView } from './PDFView';
import { ConfirmationModal } from './ConfirmationModal';
import { ChildPreview } from './ChildPreview';
import PrimaryButton from './elements/PrimaryButton';
import { RiCloseLargeFill } from 'react-icons/ri';

export const DocumentRequest = ({ requests, setRequests, setFileVisibility, requestId, setChild, child, setPreviewVisibility, role }) => {
    const axiosPrivate = useAxiosPrivate();
    const [documentUrl, setDocumentUrl] = useState(null);
    const [res, setRes] = useState('');
    const [confirmModalVisibility, setConfirmModalVisibility] = useState(false)
    const [documentData, setDocumentData] = useState(null); // add to UI
    const [req, setReq] = useState(null);
    const [loading, setLoading] = useState(false)

    const getDocument = async (documentId) => {
        try {
            let response
            console.log(req.type)
            response = await axiosPrivate.get(`/file/tempDocument/${documentId}`);
            if (response) {
                setDocumentUrl(response.data.URL);
                setChild(response.data.child);
                setDocumentData(response.data.document);
                console.log('doc dat', response.data.document)
            }

            else throw new Error('Failed to fetch document');

        } catch (error) {
            toast.error('Failed to fetch document:', error.message);
        }
    };

    const handleResponse = async (response) => {
        try {
            setLoading(true)
            let data;
            switch (req.type) {
                case 'create':
                    data = await axiosPrivate.put('/request/childDocument/', {
                        requestid: requestId,
                        response: response
                    })
                    break;
                case 'delete':
                    data = await axiosPrivate.put('/request/deleteChildDocument/', {
                        requestid: requestId,
                        response: response
                    })
                    break;
                default:
                    break;
            }
            console.log(data.data)
            const updatedRequest = data.data.data

            setRequests(requests.filter(request => request.requestid !== requestId).concat(updatedRequest))
            setLoading(false)
            toast.success('Request handled successfully');
        } catch (error) {
            console.log(error)
            toast.error('Failed to handle request:', error.message);
        }
    }

    useEffect(() => {
        const getRequestData = async () => {
            try {
                const response = await axiosPrivate.get(`/request/get/${requestId}`);
                setReq(response.data.request);
            } catch (error) {
                console.error('Failed to fetch child:', error);
            }
        };
        getRequestData();
    }, [requestId, axiosPrivate]);

    useEffect(() => {
        if (req) {
            console.log(req)
            getDocument(req.entity_key);
        }
    }, [req])

    return (
        <div className="fixed inset-0 flex  justify-center backdrop-blur-md drop-shadow-lg border  px-10 z-10">
            <section className=" px-8 py-4 mx-auto bg-white rounded-md shadow-md my-5 w-fit sm:w-5/6">

                <div className="flex justify-between items-center mb-3">
                    <h1 className="text-lg font-bold text-gray-700 capitalize flex"> Document Request </h1>
                    {/* close button */}
                    <div className='flex flex-row justify-end my-auto ml-5'>
                        <RiCloseLargeFill
                            onClick={() => setFileVisibility(false)}
                            className='bg-red-500 rounded-full text-4xl p-2 text-white drop-shadow hover:bg-red-700' />
                    </div>
                </div>
                <div>Name : {documentData ? documentData.document_name : '..'}</div>
                <div>Type : {documentData ? documentData.document_type : '..'}</div>
                {documentUrl ? <PDFView documentUrl={documentUrl} /> : <h1 className='h-[60vh] m-auto'>Document Not Found!</h1>}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 justify-end p-5 w-full ">
                    <PrimaryButton
                        onClick={() => {
                            setRes('approved')
                            setConfirmModalVisibility(true)
                        }}
                        disabled={!req || req.status != 'pending' || role != 'Head'}
                        text='Approve'
                        loading={loading} />
                    <PrimaryButton
                        onClick={() => {
                            setRes('rejected')
                            setConfirmModalVisibility(true)
                        }}
                        disabled={!req || req.status != 'pending' || role != 'Head'}
                        text='Reject'
                        loading={loading} />
                    <PrimaryButton
                        onClick={() => {
                            setPreviewVisibility(true)
                            setFileVisibility(false)
                        }}
                        disabled={!req || !child}
                        text='View Child' />

                </div>
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
        </div>
    );
};
