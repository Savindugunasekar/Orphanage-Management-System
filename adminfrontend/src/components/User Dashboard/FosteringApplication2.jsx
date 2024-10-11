import React, { useEffect, useState } from 'react';

export default function FosteringApplication2({ setStep1, setStep2, setStep3, fosteringDetails, setFosteringDetails }) {


  useEffect(() => {
    console.log(fosteringDetails);
  }, [fosteringDetails]);

  const handleChange = (e) => {
    setFosteringDetails({
      ...fosteringDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(fosteringDetails);
    setStep3(true)
    setStep2(false)
  };

  const goBack = (e) => {
    e.preventDefault();
    setStep2(false)
    setStep1(true)
  }

  return (
    <div className="mx-2 sm:mx-5 md:mx-10">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-5 md:gap-8">
          <div className="flex flex-col w-full md:w-1/2">
            <label className="mb-3 font-semibold text-md" htmlFor="homeAddress">
              Home Address:
            </label>
            <input
              className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary"
              onChange={handleChange}
              type="text"
              id="homeaddress"
              name="homeaddress"
              required
              value={fosteringDetails.homeaddress}
            />
          </div>
          <div className="flex flex-col w-full md:w-1/2">
            <label className="mb-3 font-semibold text-md" htmlFor="city">
              City:
            </label>
            <input
              className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary"
              onChange={handleChange}
              type="text"
              id="city"
              name="city"
              required
              value={fosteringDetails.city}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-5 md:gap-8">
          <div className="flex flex-col w-full md:w-1/2">
            <label className="mb-3 font-semibold text-md" htmlFor="province">
              Province:
            </label>
            <input
              className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary"
              onChange={handleChange}
              type="text"
              id="province"
              name="province"
              required
              value={fosteringDetails.province}
            />
          </div>
          <div className="flex flex-col w-full md:w-1/2">
            <label className="mb-3 font-semibold text-md" htmlFor="postalCode">
              Postal Code:
            </label>
            <input
              className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary"
              onChange={handleChange}
              type="text"
              id="postalcode"
              name="postalcode"
              required
              value={fosteringDetails.postalcode}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-5 md:gap-8">
          <div className="flex flex-col w-full md:w-1/2">
            <label className="mb-3 font-semibold text-md" htmlFor="homePhoneNumber">
              Home Phone Number:
            </label>
            <input
              className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary"
              onChange={handleChange}
              type="text"
              id="telphonenum"
              name="telphonenum"
              required
              value={fosteringDetails.telphonenum}
            />
          </div>
          <div className="flex flex-col w-full md:w-1/2">
            <label className="mb-3 font-semibold text-md" htmlFor="cellPhoneNumber">
              Cell Phone Number:
            </label>
            <input
              className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary"
              onChange={handleChange}
              type="text"
              id="cellphonenum"
              name="cellphonenum"
              required
              value={fosteringDetails.cellphonenum}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-5 md:gap-8">
          <div className="flex flex-col w-full">
            <label className="mb-3 font-semibold text-md" htmlFor="emailAddress">
              Email Address:
            </label>
            <input
              className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary"
              onChange={handleChange}
              type="text"
              id="emailaddress"
              name="emailaddress"
              required
              value={fosteringDetails.emailaddress}
            />
          </div>
        </div>

        <div className="flex flex-row justify-between mt-5">
          <button
            type="button"
            className="my-2 items-center justify-center w-40 text-primary border-2 border-primary px-4 py-2 text-xl flex gap-3 hover:gap-5  hover:text-white hover:bg-primary transition-all duration-300 group text-center"
            onClick={goBack}
          >
            Back
          </button>
          <button
            type="submit"
            className="my-2 items-center justify-center w-40 text-primary border-2 border-primary px-4 py-2 text-xl flex gap-3 hover:gap-5  hover:text-white hover:bg-primary transition-all duration-300 group text-center"
          >
            Next Page
          </button>
        </div>
      </form>
    </div>

  );
}
