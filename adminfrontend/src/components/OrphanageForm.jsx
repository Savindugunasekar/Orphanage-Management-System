import React, { useState } from "react";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

const OrphanageForm = () => {
  const axiosPrivate = useAxiosPrivate();

  // List of districts in Sri Lanka
  const districts = [
    "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
    "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
    "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
    "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
    "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
  ];

  // State with required fields including district
  const [orphanageDetails, setOrphanageDetails] = useState({
    orphanagename: "",
    address: "",
    capacity: 0,
    telno: "",
    head_email: "",
    district: "" // New state field for district
  });

  // Handler to update the state when input changes
  const detailHandler = (e) => {
    setOrphanageDetails({
      ...orphanageDetails,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle form submission using axios
  const addOrphanage = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.post("/orphanage", orphanageDetails, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        console.log("Orphanage added successfully");

        // Reset form fields
        setOrphanageDetails({
          orphanagename: "",
          address: "",
          capacity: 0,
          telno: "",
          head_email: "",
          district: "" // Reset district as well
        });
      } else {
        console.error("Failed to add orphanage");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-10">
      <h1 className="text-2xl font-bold text-center my-10 relative">
        Submit New Orphanage
        <span className="block w-[100px] h-1 bg-primary mx-auto mt-3"></span>
      </h1>

      <form className="flex flex-col gap-5" onSubmit={addOrphanage}>
        <div className="flex flex-col gap-5 md:flex-row">
          <div className="flex flex-col w-full">
            <label className="text-md font-semibold mb-3" htmlFor="orphanagename">
              Orphanage Name:
            </label>
            <input
              className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary !important"
              type="text"
              onChange={detailHandler}
              id="orphanagename"
              name="orphanagename"
              value={orphanageDetails.orphanagename}
              required
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="text-md font-semibold mb-3" htmlFor="address">
              Address:
            </label>
            <input
              className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary !important"
              type="text"
              onChange={detailHandler}
              id="address"
              name="address"
              value={orphanageDetails.address}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <div className="flex flex-col w-full">
            <label className="text-md font-semibold mb-3" htmlFor="capacity">
              Capacity:
            </label>
            <input
              className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary !important"
              type="number"
              onChange={detailHandler}
              id="capacity"
              name="capacity"
              value={orphanageDetails.capacity}
              min="0"
              required
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="text-md font-semibold mb-3" htmlFor="telno">
              Tel Number:
            </label>
            <input
              className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary !important"
              type="tel"
              onChange={detailHandler}
              id="telno"
              name="telno"
              value={orphanageDetails.telno}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <div className="flex flex-col w-full">
            <label className="text-md font-semibold mb-3" htmlFor="head_email">
              Head Email:
            </label>
            <input
              className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary !important"
              type="email"
              id="head_email"
              onChange={detailHandler}
              name="head_email"
              value={orphanageDetails.head_email}
              required
            />
          </div>
        </div>

        <div className="flex flex-col w-full">
          <label className="text-md font-semibold mb-3" htmlFor="district">
            District:
          </label>
          <select
            className="w-full bg-gray-100 h-[40px] rounded-md px-4  border-none focus-visible:ring-primary !important"
            id="district"
            name="district"
            value={orphanageDetails.district}
            onChange={detailHandler}
            required
          >
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-primary text-white font-semibold mb-10 w-1/4 py-3 hover:bg-white hover:border-2 hover:border-primary hover:text-primary transition-all duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default OrphanageForm;
