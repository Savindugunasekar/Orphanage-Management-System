import React, { useEffect, useState } from 'react'
import PrimaryButton from './elements/PrimaryButton'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const AssignModal = ({ showModal, closeModal, orphanageList, onSubmit, type }) => {

    const [email, setEmail] = useState('')
    const [selectedOrphanageId, setSelectedOrphanageId] = useState('')
    const [validEmail, setValidEmail] = useState(false);
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        setLoading(true)
        await onSubmit({ email, orphanageId: selectedOrphanageId })
        setSelectedOrphanageId('')
        setEmail('')
        setLoading(false)
        closeModal();
    }

    const handleOrphanageChange = (e) => {
        setSelectedOrphanageId(e.target.value)
    }

    useEffect(() => {
        if (EMAIL_REGEX.test(email)) {
            setValidEmail(true)
        } else {
            setValidEmail(false)
        }
    }, [email])

    if (!showModal) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm py-20 ">
            <div id="scrollview" className="bg-white rounded drop-shadow-lg w-fit h-fit mt-10 mx-10 border p-10">
                <h2 className='mb-4 text-xl font-bold'>Assign {type}</h2>
                <label className='block mb-2'>{type} Email:</label>
                <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full p-2 mb-4 border rounded'
                />
                <label className='block mb-2'>Select Orphanage:</label>
                <select
                    value={selectedOrphanageId}
                    onChange={handleOrphanageChange}
                    className='w-full p-2 mb-4 border rounded'
                >
                    <option value=''>Select Orphanage</option>
                    {orphanageList.map((orphanage, index) => (
                        <option key={index} value={orphanage.orphanageid}>
                            {orphanage.orphanagename}
                        </option>
                    ))}
                </select>
                <div className='flex justify-end'>
                    <PrimaryButton
                        onClick={closeModal}
                        text={' Cancel'}
                        color='red'
                        loading={loading}
                        className={'mx-2'} />
                    <PrimaryButton
                        onClick={handleSubmit}
                        text={' Assign'}
                        loading={loading}
                        className={'mx-2'}
                        disabled={!validEmail || !selectedOrphanageId}
                    />
                </div>
            </div>
        </div>
    )
}
