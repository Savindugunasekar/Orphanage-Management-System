import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AgeSlider from '../AgeSlider';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import AlertModal from '../AlertModal';
import toast from 'react-hot-toast';

export default function FosteringApplication3({ setStep2, setStep3, fosteringDetails, setFosteringDetails }) {

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    console.log(fosteringDetails);
  }, [fosteringDetails]);

  const handleChange = (e) => {
    setFosteringDetails({
      ...fosteringDetails,
      [e.target.name]: e.target.value,
    });
  };

  const updateAgeRange = (value) => {
    setFosteringDetails({
      ...fosteringDetails,
      ageRange: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.post("/application", fosteringDetails, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        // Reset form fields
        setFosteringDetails({
          ageRange: [0, 18]
        });
        toast.success("Application added successfully");
        setShowModal(true);

      } else {
        console.error("Failed to add application");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    navigate('/user/dashboard')
  };

  const goBack = (e) => {
    e.preventDefault();
    setStep2(true)
    setStep3(false)
  }

  return (
    <div className="mx-2 sm:mx-5 md:mx-10">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex flex-col w-full lg:w-1/2">
            <label className="mb-3 font-semibold text-md" htmlFor="genderofchild">
              Gender of Child you prefer:
            </label>
            <select
              className="w-full bg-gray-100 h-[50px] rounded-md px-4 py-3 border-none focus-visible:ring-primary !important"
              onChange={handleChange}
              name="genderofchild"
              id="genderofchild"
              required
              value={fosteringDetails.genderofchild}
            >
              <option value="" disabled selected>Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="any">Any</option>
            </select>
          </div>
          <div className="flex flex-col w-full lg:w-1/2 my-auto">
            <AgeSlider ageRange={fosteringDetails.ageRange} setAgeRange={updateAgeRange} />
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col w-full">
            <label className="mb-3 font-semibold text-md" htmlFor="reasonforfostering">
              Reason for fostering:
            </label>
            <textarea
              className="w-full bg-gray-100 h-[100px] rounded-md px-4 py-3 border-none focus-visible:ring-primary !important"
              onChange={handleChange}
              type="text"
              id="reasonforfostering"
              name="reasonforfostering"
              required
              value={fosteringDetails.reasonforfostering}
            />
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col w-full">
            <label className="mb-3 font-semibold text-md" htmlFor="specificneeds">
              Any specific needs or disabilities you are willing to consider:
            </label>
            <textarea
              className="w-full bg-gray-100 h-[100px] rounded-md px-4 py-3 border-none focus-visible:ring-primary !important"
              onChange={handleChange}
              type="text"
              id="specificneeds"
              name="specificneeds"
              required
              value={fosteringDetails.specificneeds}
            />
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col w-full">
            <label className="mb-3 font-semibold text-md" htmlFor="additionalcomments">
              Additional Comments we should be aware of:
            </label>
            <textarea
              className="w-full bg-gray-100 h-[100px] rounded-md px-4 py-3 border-none focus-visible:ring-primary !important"
              onChange={handleChange}
              type="text"
              id="additionalcomments"
              name="additionalcomments"
              required
              value={fosteringDetails.additionalcomments}
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
            Submit
          </button>

        </div>
      </form>

      <AlertModal
        showModal={showModal}
        onClose={closeModal}
        message="Your application has been submitted for review"
      />
    </div>

  );
}
