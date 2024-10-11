import { useState } from 'react'
import axios from 'axios';
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import toast from 'react-hot-toast';
import { ConfirmationModal } from './ConfirmationModal';
import PrimaryButton from './elements/PrimaryButton';

export const ChildAddFormStep2 = ({ reqId, setFormVisibility }) => {

    const axiosPrivate = useAxiosPrivate()
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [confirmModalVisibility, setConfirmModalVisibility] = useState(false);
    const [loading, setLoading] = useState(false)

    const handleChange = (event) => {
        setFile(event.target.files[0]);
        setUploadProgress(0);
    }

    const handleConfirmation = async () => {
        setLoading(true)
        setConfirmModalVisibility(false);
        const response = await handleSubmit();
        setLoading(false)
        if (response) {
            setFormVisibility(false);
        }
    }

    const handleSubmit = async () => {

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
            const response = await axiosPrivate.get(`/file/childPhotoUpload/${reqId}.${file.type.split('/')[1]}`); /********************** */

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
            <form className=' grid h-[45vh] overflow-y-auto'>
                <h1 className=''>Select a photo of the child</h1>
                <input type="file" onChange={handleChange} accept="image/*" className="file-input w-full max-w-xs" />
                {file ? <img className=" h-36 w-36 m-auto rounded-full " src={URL.createObjectURL(file)} alt="Select" /> : <div className='h-36 w-36 row-span-6 rounded-full mx-auto bg-gray-300'></div>}
                {uploadProgress && <progress className="progress w-72 my-5 mx-auto" value={uploadProgress} max="100"></progress>}
                <div className=" flex justify-end ">
                    <PrimaryButton
                        onClick={handleClick}
                        disabled={!file}
                        text={'upload'}
                        loading={loading} />

                </div>

            </form>
            {confirmModalVisibility && <ConfirmationModal head="Add Child Request" body="Are you sure you want to create add child request?" handleConfirmation={handleConfirmation} setVisibility={setConfirmModalVisibility} />}
        </div>
    )
}
