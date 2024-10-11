import React, { useEffect, useState } from 'react'
import { RiCloseLargeFill } from "react-icons/ri";
import AvatarPlaceHolder from '../assets/images/avatar_placeholder.png'
import PrimaryButton from './elements/PrimaryButton';
import toast from 'react-hot-toast';
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import axios from 'axios';

const ImagePreview = ({ imageURL, setImagePreview, child, setImageURL }) => {

    const axiosPrivate = useAxiosPrivate()

    const [image, setImage] = useState(imageURL ? imageURL : AvatarPlaceHolder)
    const [newImage, setNewImage] = useState('')
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(false)

    const [uploadText, setUploadText] = useState('Upload')
    const [deleteText, setDeleteText] = useState('Delete')

    const handleChange = (event) => {
        setNewImage(event.target.files[0]);
        setUploadProgress(0);
    }

    const clearImage = () => {
        setNewImage('')
    }

    const getPhoto = async () => {
        try {
            const response = await axiosPrivate.get(`/file/childPhotoDownload/${child.childid}`);
            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            setImageURL(response.data.URL)
        } catch (error) {
            console.error('Failed to fetch photo:', error)
        }
    }

    const uploadImage = async () => {
        setLoading(true)
        setUploadText(<span className="loading loading-infinity loading-sm"></span>)

        if (!newImage) {
            toast.error('Please select a file');
            return false;
        }
        if (!newImage.type.startsWith('image')) {
            toast.error('Please select an image file');
            return false;
        }
        if (newImage.size > 1024 * 1024 * 2) {
            toast.error('File size should not exceed 2MB');
            return false;
        }

        try {
            const response = await axiosPrivate.get(`/file/childPhotoUpdate/${child.childid}.${newImage.type.split('/')[1]}`); /********************** */

            if (!response.data.success) {
                toast.error(response.data.message);
                return false;
            }

            await axios.put(response.data.URL, newImage, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            })

            await getPhoto()
            toast.success('File uploaded successfully');
            setLoading(false)
            clearImage()
            setImagePreview(false)
        } catch (error) {
            console.log('Error uploading file:', error);
            toast.error('Failed to upload file');
            setImagePreview(false)
        }

    }

    const deleteImage = async () => {
        setLoading(true)
        setDeleteText(<span className="loading loading-infinity loading-sm"></span>)
        try {
            await axiosPrivate.delete(`/file/childPhotoUpdate/${child.childid}`);
            setImageURL('')
            toast.success('Image deleted successfully');
            setLoading(false)
            setImagePreview(false)

        }
        catch (error) {
            console.log('Error delete file:', error);
            toast.error('Failed to delete file');
            setLoading(false)
        }

    }

    useEffect(() => {
        setUploadText('Upload')
        setDeleteText('Delete')
    }, [loading])

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md  py-20 ">
            <section className=" px-8 py-4 m-auto bg-white rounded-md shadow-lg w-fit h-fit overflow-auto border">
                {/* close button */}
                <div className='flex flex-row justify-between '>
                    <h1 className='text-2xl mt-2 mb-5'>Update profile Picture</h1>
                    <RiCloseLargeFill
                        onClick={() => setImagePreview(false)}
                        className='bg-red-500 rounded-full text-4xl p-2 text-white drop-shadow hover:bg-red-700' />
                </div>

                {/* body */}
                <div className=' flex flex-col items-center'>

                    {/* image */}
                    <div className="avatar">
                        <div className="w-36 md:w-48 lg:w-96  rounded-full">
                            <img src={newImage ? URL.createObjectURL(newImage) : image} />
                        </div>
                    </div>
                    {loading && <progress className="progress w-full mt-10 " value={uploadProgress} max="100"></progress>}
                    <div className='my-10 flex flex-col items-center'>

                        <input type="file" onChange={handleChange} className="file-input file-input-bordered w-full" accept="image/*" disabled={loading} />
                        {(imageURL && !newImage) && <PrimaryButton
                            text={'Delete'}
                            className='my-3'
                            onClick={deleteImage}
                            loading={loading}
                            color='red' />}
                        <div>
                            {newImage && <PrimaryButton
                                text={'Upload'}
                                className='my-3'
                                color='blue'
                                onClick={uploadImage}
                                loading={loading} />}
                            {newImage && <PrimaryButton onClick={clearImage} text='Clear' className='m-3' color='red' disabled={loading && true} />}
                        </div>

                    </div>
                </div>

            </section>
        </div>
    )
}

export default ImagePreview