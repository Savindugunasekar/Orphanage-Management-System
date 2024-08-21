import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AgeSlider from './AgeSlider';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

export default function FosteringApplication3() {
  const axiosPrivate = useAxiosPrivate();
  
  const location = useLocation();
  const navigate = useNavigate();
  const fosteringDetails2 = location.state || {}; // Initialize to an empty object if state is undefined
  
 
  const [ageRange, setAgeRange] = useState([0, 18]); 
  const [fosteringDetails3, setFosteringDetails3] = useState({
    ...fosteringDetails2,
    genderofchild: "",
    ageRange: [0, 18],
    reasonforfostering: "",
    specificneeds: "",
    additionalcomments: "",
  });

  useEffect(() => {
    console.log(fosteringDetails3);
  }, [fosteringDetails3]);

  const handleChange = (e) => {
    setFosteringDetails3({
      ...fosteringDetails3,
      [e.target.name]: e.target.value,
    });
  };

  const updateAgeRange = (value) => {
    setFosteringDetails3({
      ...fosteringDetails3,
      ageRange: value,
    });
    setAgeRange(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.post("/application", fosteringDetails3, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        // Reset form fields
        setFosteringDetails3({
          ...fosteringDetails3,
          genderofchild: "",
          ageRange: [0, 18],
          reasonforfostering: "",
          specificneeds: "",
          additionalcomments: "",
        });
        console.log("Application added successfully");
        alert("application send succesfully you will recieve notification soon")
        navigate('/userdash'); // Navigate to a confirmation page or any other page
      } else {
        console.error("Failed to add application");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-10">
      <h1 className="relative my-10 text-2xl font-bold text-center">
        About the Kids
        <span className="block w-[100px] h-1 bg-primary mx-auto mt-3"></span>
      </h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-row gap-8">
          <div className="flex flex-col w-1/2">
            <label className="mb-3 font-semibold text-md" htmlFor="genderofchild">
              Gender of Child you prefer:
            </label>
            <select
              className="w-full bg-gray-100 h-[50px] rounded-md px-4 py-3 border-none focus-visible:ring-primary !important"
              onChange={handleChange}
              name="genderofchild"
              id="genderofchild"
              required
            >
              <option value="" disabled selected>Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="any">Any</option>
            </select>
          </div>
          <div className="flex flex-col w-1/2" name='ageRange'>
            <AgeSlider ageRange={ageRange} setAgeRange={updateAgeRange} />
          </div>
        </div>

        <div className="flex flex-row gap-8">
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
            />
          </div>
        </div>
        <div className="flex flex-row gap-8">
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
            />
          </div>
        </div>

        <div className="flex flex-row gap-8">
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
            />
          </div>
        </div>
        <div className="flex flex-row gap-8">
          <button 
            type="submit"
            className="w-[200px] h-[40px] bg-primary text-white rounded-md mt-5 mx-auto"
          >
            Submit
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
