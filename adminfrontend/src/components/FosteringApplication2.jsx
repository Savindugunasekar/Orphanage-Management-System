import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function FosteringApplication2() {
  const location = useLocation();
  const fosteringDetails = location.state || {}; // Initialize to an empty object if state is undefined

  const [fosteringDetails2, setFosteringDetails2] = useState({
    ...fosteringDetails,
    homeaddress: "",
    city: "",
    province: "",
    postalCode: "",
    telphonenum: "",
    cellphonenum: "",
    emailaddress: "",
  });

  const navigate = useNavigate();
  
  useEffect(() => {
    console.log(fosteringDetails2);
  }, [fosteringDetails2]);

  const handleChange = (e) => {
    setFosteringDetails2({
      ...fosteringDetails2,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const path = `/fostering3`;
    console.log(fosteringDetails2);
    navigate(path, { state: fosteringDetails2 });
  };

  return (
    <div className="mx-10">
      <h1 className="relative my-10 text-2xl font-bold text-center">
        Contact Information
        <span className="block w-[100px] h-1 bg-primary mx-auto mt-3"></span>
      </h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-row gap-8">
          <div className="flex flex-col w-1/2">
            <label className="mb-3 font-semibold text-md" htmlFor="homeAddress">
              Home Address:
            </label>
            <input
              className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary !important"
              onChange={handleChange}
              type="text"
              id="homeaddress"              
              name="homeaddress"
              required
            />
          </div>
          <div className="flex flex-col w-1/2">
            <label className="mb-3 font-semibold text-md" htmlFor="city">
              City:
            </label>
            <input
              className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary !important"
              onChange={handleChange}
              type="text"
              id="city"
              name="city"
              required
            />
          </div>
        </div>

        <div className="flex flex-row gap-8">
          <div className="flex flex-col w-1/2">
            <label className="mb-3 font-semibold text-md" htmlFor="province">
              Province:
            </label>
            <input
              className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary !important"
              onChange={handleChange}
              type="text"
              id="province"
              name="province"
              required
            />
          </div>
          <div className="flex flex-col w-1/2">
            <label className="mb-3 font-semibold text-md" htmlFor="postalCode">
              Postal Code:
            </label>
            <input
              className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary !important"
              onChange={handleChange}
              type="text"
              id="postalcode"
              name="postalcode"
              required
            />
          </div>
        </div>

        <div className="flex flex-row gap-8">
          <div className="flex flex-col w-1/2">
            <label className="mb-3 font-semibold text-md" htmlFor="homePhoneNumber">
              Home Phone Number:
            </label>
            <input
              className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary !important"
              onChange={handleChange}
              type="text"
              id="telphonenum"
              name="telphonenum"
              required
            />
          </div>
          <div className="flex flex-col w-1/2">
            <label className="mb-3 font-semibold text-md" htmlFor="cellPhoneNumber">
              Cell Phone Number:
            </label>
            <input
              className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary !important"
              onChange={handleChange}
              type="text"
              id="cellphonenum"              
              name="cellphonenum"
              required
            />
          </div>
        </div>

        <div className="flex flex-row gap-8">
          <div className="flex flex-col w-1/2">
            <label className="mb-3 font-semibold text-md" htmlFor="emailAddress">
              Email Address:
            </label>
            <input
              className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary !important"
              onChange={handleChange}
              type="text"
              id="emailaddress"              
              name="emailaddress"
              required
            />
          </div>
        </div>
        <div className="flex flex-row gap-8">
          <button
            type="submit"
            className="w-[200px] h-[40px] bg-primary text-white rounded-md mt-5 mx-auto"
          >
            Next Page
          </button>
          <button
            type="button"
            className="w-[200px] h-[40px] bg-primary text-white rounded-md mt-5 mx-auto"
            onClick={() => window.history.back()}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}
