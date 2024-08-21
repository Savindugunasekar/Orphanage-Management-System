import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth'
import {jwtDecode} from "jwt-decode"; // Remove curly braces around jwtDecode

export default function FosteringApplication() {
    const navigate = useNavigate()
    const { auth } = useAuth()
    const decoded = auth?.accessToken ? jwtDecode(auth.accessToken) : undefined
    const userId = decoded?.UserInfo?.userId || []
    const username = decoded?.UserInfo?.username || []

    const [fosteringDetails, setFosteringDetails] = useState({});

    useEffect(() => {
        console.log(fosteringDetails);
    }, [fosteringDetails]);

    const handleChange = (e) => {
        e.preventDefault();
        setFosteringDetails({
            ...fosteringDetails,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedDetails = {
            ...fosteringDetails,
            userId: userId,
            username: username,
        };
        setFosteringDetails(updatedDetails);

        const path = `/fostering2`;
        navigate(path, { state: updatedDetails });
    }

    return (
        <div className="mx-10">
            <h1 className="relative my-10 text-2xl font-bold text-center">
                Fostering Application
                <span className="block w-[100px] h-1 bg-primary mx-auto mt-3"></span>
            </h1>
            <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
                <div className='flex flex-row gap-8'>
                    <div className="flex flex-col w-1/2">
                        <label className="mb-3 font-semibold text-md" htmlFor="firstname">
                            First Name:
                        </label>
                        <input
                            className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary !important"
                            onChange={handleChange}
                            type="text"
                            id="firstname"
                            name="firstname"
                            required
                        />
                    </div>
                    <div className="flex flex-col w-1/2">
                        <label className="mb-3 font-semibold text-md" htmlFor="lastname">
                            Last Name:
                        </label>
                        <input
                            className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary !important"
                            onChange={handleChange}
                            type="text"
                            id="lastname"
                            name="lastname"
                            required
                        />
                    </div>
                </div>

                <div className='flex flex-row gap-8'>
                    <div className="flex flex-col w-1/2">
                        <label className="mb-3 font-semibold text-md" htmlFor="gender">
                            Gender:
                        </label>
                        <select
                            className="w-full bg-gray-100 h-[50px] rounded-md px-4 py-3 border-none focus-visible:ring-primary !important"
                            onChange={handleChange}
                            id="gender"
                            name="gender"
                            required
                        >
                            <option value="" disabled selected>Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="any">Any</option>
                        </select>
                    </div>
                    <div className="flex flex-col w-1/2">
                        <label className="mb-3 font-semibold text-md" htmlFor="dob">
                            Date of Birth:
                        </label>
                        <input
                            className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary !important"
                            onChange={handleChange}
                            type="date"
                            id="dob"
                            name="dob"
                            required
                        />
                    </div>
                </div>

                <div className='flex flex-row gap-8'>
                    <div className="flex flex-col w-1/2">
                        <label className="mb-3 font-semibold text-md" htmlFor="gender">
                            National Identity Number:
                        </label>
                        <input
                            className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary !important"
                            onChange={handleChange}
                            type="text"
                            id="nic"
                            name="nic"
                            required
                        />
                    </div>
                    <div className="flex flex-col w-1/2">
                        <label className="mb-3 font-semibold text-md" htmlFor="dob">
                            Occupation:
                        </label>
                        <input
                            className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary !important"
                            onChange={handleChange}
                            type="text"
                            id="occupation"
                            name="occupation"
                            required
                        />
                    </div>
                </div>

                <div className='flex flex-row gap-8'>
                    <div className="flex flex-col w-1/2">
                        <label className="mb-3 font-semibold text-md" htmlFor="race">
                            Nationality:
                        </label>
                        <input
                            className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary !important"
                            onChange={handleChange}
                            type="text"
                            id="nationality"
                            name="nationality"
                            required
                        />
                    </div>
                    <div className="flex flex-col w-1/2">
                        <label className="mb-3 font-semibold text-md" htmlFor="religion">
                            Religion:
                        </label>
                        <input
                            className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary !important"
                            onChange={handleChange}
                            type="text"
                            id="religion"
                            name="religion"
                            required
                        />
                    </div>
                </div>

                <div className='flex flex-row gap-8'>
                    <div className="flex flex-col w-1/2">
                        <label className="mb-3 font-semibold text-md" htmlFor="culturalbackground">
                            Number of Family Members with You:
                        </label>
                        <input
                            className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary !important"
                            onChange={handleChange}
                            type="number"
                            min={0}
                            id="nooffamilymembers"
                            name="nooffamilymembers"
                            required
                        />
                    </div>
                    <div className="flex flex-col w-1/2">
                        <label className="mb-3 font-semibold text-md" htmlFor="languagespoken">
                            Average Monthly Income:
                        </label>
                        <input
                            className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary !important"
                            onChange={handleChange}
                            type="text"
                            id="monthlyincome"
                            name="monthlyincome"
                            required
                        />
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <label className="mb-3 font-semibold text-md" htmlFor="additionalNote">
                        Additional Note:
                    </label>
                    <textarea
                        className="w-full bg-gray-100 h-[100px] rounded-md px-4 py-3 border-none focus-visible:ring-primary"
                        onChange={handleChange}
                        id="additionalnote"
                        name="additionalnote"
                        required
                    />
                </div>

                <div className='flex flex-row gap-8'>

                    <button
                        type='submit'
                        className="w-[200px] h-[40px] bg-primary text-white rounded-md mt-5 mx-auto"
                    >
                        Next Page
                    </button>
                    <button
                        className="w-[200px] h-[40px] bg-primary text-white rounded-md mt-5 mx-auto 0" onClick={() => window.history.back()}
                    >
                        Back
                    </button>
                </div>
            </form>
        </div>
    )
}
