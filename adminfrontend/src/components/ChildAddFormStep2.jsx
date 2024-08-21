import { useState } from 'react'
import axios from 'axios';
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import toast from 'react-hot-toast';
import { ConfirmationModal } from './ConfirmationModal';

export const ChildAddFormStep2 = ({ reqId, setFormVisibility }) => {

    const axiosPrivate = useAxiosPrivate()
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [confirmModalVisibility, setConfirmModalVisibility] = useState(false);

    const handleChange = (event) => {
        setFile(event.target.files[0]);
        setUploadProgress(0);
    }

    const handleConfirmation = async () => {
        const response = await handleSubmit();
        if (response) {
            setFormVisibility(false);
        }

    }

    const handleSubmit = async () => {
        setConfirmModalVisibility(false);
        if (!file) {
            toast.error('Please select a file');
            return false;
        }
        if (!file.type.startsWith('image')) {
            toast.error('Please select an image file');
            return false;
        }
        if (file.size > 1024 * 1024 * 2) {
            toast.error('File size should not exceed 2MB');
            return false;
        }

        try {
            const response = await axiosPrivate.get(`/file/childPhoto/${reqId}.${file.type.split('/')[1]}`); /********************** */

            if (!response.data.success) {
                toast.error(response.data.message);
                return false;
            }

            await axios.put(response.data.URL, file, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            })

            toast.success('File uploaded successfully');
            return true;
        } catch (error) {
            console.log('Error uploading file:', error);
            toast.error('Failed to upload file');
            return false;
        }
    }

    const handleClick = (e) => {
        e.preventDefault();
        setConfirmModalVisibility(true);
    }
    return (
        <div >
            <form className=' grid grid-rows-12'>
                <h1 className='row-span-1'>Select a photo of the child</h1>
                <input type="file" onChange={handleChange} accept="image/*" />
                {file ? <img className="h-96 w-96 m-auto rounded-full row-span-6" src={URL.createObjectURL(file)} alt="Select" /> : <div className='h-96 w-96 row-span-6 rounded-full mx-auto bg-gray-300'></div>}
                <progress value={uploadProgress} max="100" className='w-full my-4 '></progress>
                <div className="row-span-1 flex justify-end ">
                    <button
                        onClick={handleClick}
                        disabled={!file}
                        className="h-fit my-auto items-end bg-transparent hover:bg-orange-500 text-orange-500 font-semibold hover:text-white py-2 px-4 border border-orange-500 hover:border-transparent rounded disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300 disabled:cursor-not-allowed">
                        upload
                    </button>
                </div>

            </form>
            {confirmModalVisibility && <ConfirmationModal head="Add Child Request" body="Are you sure you want to create add child request?" handleConfirmation={handleConfirmation} setVisibility={setConfirmModalVisibility} />}
        </div>
    )
}
