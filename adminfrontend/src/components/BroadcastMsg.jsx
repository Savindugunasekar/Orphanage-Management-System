import React from 'react'
import { useState } from 'react'
import { rolesList } from "../constants";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import toast from 'react-hot-toast';

export default function BroadcastMsg() {

    const [massage, setMassage] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const axiosPrivate = useAxiosPrivate()

    const handleGroupChange = (e) => {
        setSelectedGroup(e.target.value)
    }

    const handleMassage = async (data) => {
        console.log("Inside the handle massage...");
        try {
            await axiosPrivate.post("/broadcast", data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            toast.success('Message sent successfully');
        } catch (error) {
            toast.error('Failed to send message');
            console.log(error);
        }
    };

    const handleSubmit = () => {
        handleMassage({ massage, selectedGroup });
        console.log(massage, selectedGroup);
    }


    return (
        <div>
            <div className=' p-5 bg-white rounded shadow-lg'>
                <h2 className='mb-4 text-xl font-bold'>Broadcast Message</h2>

                <label className='block mb-2'>Type Your Message:</label>
                <textarea
                    value={massage}
                    onChange={(e) => setMassage(e.target.value)}
                    className='w-full h-32 p-2 mb-4 border border-gray-300 rounded'
                    placeholder='Type your message here...'
                />

                <label className='block mb-2'>Select the Role:</label>
                <select
                    value={selectedGroup}
                    onChange={handleGroupChange}
                    className='w-full p-2 mb-4 border border-gray-300 rounded'
                >
                    <option value=''>Select Group</option>
                    {rolesList.map((role, index) => (
                        <option key={index} value={role.rolename}>
                            {role.rolename}
                        </option>
                    ))}
                </select>
                <div className='flex justify-end'>
                    <button
                        onClick={handleSubmit}
                        className='px-4 py-2 mr-5 text-white rounded bg-primary'
                    >
                        Send Message
                    </button>
                </div>
            </div>
        </div>
    );

}
