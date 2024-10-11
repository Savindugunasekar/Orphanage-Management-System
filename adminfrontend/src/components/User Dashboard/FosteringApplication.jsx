import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { jwtDecode } from "jwt-decode"; // Remove curly braces around jwtDecode

export default function FosteringApplication({ setStep1, setStep2, fosteringDetails, setFosteringDetails }) {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const decoded = auth?.accessToken ? jwtDecode(auth.accessToken) : undefined;
  const userId = decoded?.UserInfo?.userId || [];
  const username = decoded?.UserInfo?.username || [];


  useEffect(() => {
    console.log(fosteringDetails);
  }, [fosteringDetails]);

  const handleChange = (e) => {
    e.preventDefault();
    setFosteringDetails({
      ...fosteringDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFosteringDetails({ ...fosteringDetails, userId, username });
    setStep2(true);
    setStep1(false);
  };

  return (
    <div className="mx-5 md:mx-10">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

        <div className="flex flex-col md:flex-row gap-5 md:gap-8">
          <div className="flex flex-col w-full md:w-1/2">
            <label className="mb-2 font-semibold text-md" htmlFor="firstname">First Name:</label>
            <input
              className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary"
              onChange={handleChange}
              type="text"
              id="firstname"
              name="firstname"
              required
              value={fosteringDetails.firstname}
            />
          </div>
          <div className="flex flex-col w-full md:w-1/2">
            <label className="mb-2 font-semibold text-md" htmlFor="lastname">Last Name:</label>
            <input
              className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary"
              onChange={handleChange}
              type="text"
              id="lastname"
              name="lastname"
              required
              value={fosteringDetails.lastname}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-5 md:gap-8">
          <div className="flex flex-col w-full md:w-1/2">
            <label className="mb-2 font-semibold text-md" htmlFor="gender">Gender:</label>
            <select
              className="w-full bg-gray-100 h-[50px] rounded-md px-4 py-3 border-none focus-visible:ring-primary"
              onChange={handleChange}
              id="gender"
              name="gender"
              required
              value={fosteringDetails.gender}
            >
              <option value="" disabled selected>Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="any">Any</option>
            </select>
          </div>
          <div className="flex flex-col w-full md:w-1/2">
            <label className="mb-2 font-semibold text-md" htmlFor="dob">Date of Birth:</label>
            <input
              className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary"
              onChange={handleChange}
              type="date"
              id="dob"
              name="dob"
              required
              value={fosteringDetails.dob}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-5 md:gap-8">
          <div className="flex flex-col w-full md:w-1/2">
            <label className="mb-2 font-semibold text-md" htmlFor="nic">National Identity Number:</label>
            <input
              className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary"
              onChange={handleChange}
              type="text"
              id="nic"
              name="nic"
              required
              value={fosteringDetails.nic}
            />
          </div>
          <div className="flex flex-col w-full md:w-1/2">
            <label className="mb-2 font-semibold text-md" htmlFor="occupation">Occupation:</label>
            <input
              className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary"
              onChange={handleChange}
              type="text"
              id="occupation"
              name="occupation"
              required
              value={fosteringDetails.occupation}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-5 md:gap-8">
          <div className="flex flex-col w-full md:w-1/2">
            <label className="mb-2 font-semibold text-md" htmlFor="nationality">Nationality:</label>
            <input
              className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary"
              onChange={handleChange}
              type="text"
              id="nationality"
              name="nationality"
              required
              value={fosteringDetails.nationality}
            />
          </div>
          <div className="flex flex-col w-full md:w-1/2">
            <label className="mb-2 font-semibold text-md" htmlFor="religion">Religion:</label>
            <input
              className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary"
              onChange={handleChange}
              type="text"
              id="religion"
              name="religion"
              required
              value={fosteringDetails.religion}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-5 md:gap-8">
          <div className="flex flex-col w-full md:w-1/2">
            <label className="mb-2 font-semibold text-md" htmlFor="nooffamilymembers">Number of Family Members with You:</label>
            <input
              className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary"
              onChange={handleChange}
              type="number"
              min={0}
              id="nooffamilymembers"
              name="nooffamilymembers"
              required
              value={fosteringDetails.nooffamilymembers}
            />
          </div>
          <div className="flex flex-col w-full md:w-1/2">
            <label className="mb-2 font-semibold text-md" htmlFor="monthlyincome">Average Monthly Income:</label>
            <input
              className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary"
              onChange={handleChange}
              type="text"
              id="monthlyincome"
              name="monthlyincome"
              required
              value={fosteringDetails.monthlyincome}
            />
          </div>
        </div>

        <div className="flex flex-col w-full">
          <label className="mb-2 font-semibold text-md" htmlFor="additionalnote">Additional Note:</label>
          <textarea
            className="w-full bg-gray-100 h-[100px] rounded-md px-4 py-3 border-none focus-visible:ring-primary"
            onChange={handleChange}
            id="additionalnote"
            name="additionalnote"
            value={fosteringDetails.additionalnote}
            required
          />
        </div>

        <div className="flex flex-row justify-end">
          <button
            type="submit"
            className="my-2 items-center justify-center w-40 text-primary border-2 border-primary px-4 py-2 text-xl flex gap-3 hover:gap-5  hover:text-white hover:bg-primary transition-all duration-300 group text-center"
          >
            Next
          </button>
        </div>

      </form>
    </div>

  );
}
