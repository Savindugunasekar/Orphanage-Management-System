import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import {countries,country_currency} from "../assets/assets";

export default function Payment() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    nic: "",
    country: "",
    phone: "",
    amount: 0,
    currency: ""
  });

  // Handle form field changes
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    
    // If the field is 'country', update the currency accordingly
    if (name === "country") {
      const selectedCurrency = country_currency[value] || "USD"; // Default to USD if country is not found
      setData((prevData) => ({
        ...prevData,
        country: value,
        currency: selectedCurrency,
      }));
    } else {
      setData((prevData) => ({ ...prevData, [name]: value }));
    }
  };
  
  // Handle order placement
  const donate = async (event) => {
    event.preventDefault();
    console.log("Inside the donate function");
    
    try {
      const url = "http://localhost:4000"; // Define your API URL here
      const response = await axios.post(`${url}/donate`, data);

      console.log("Order Response:", response.data);

      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url); // Redirect to Stripe payment page
      } else {
        console.error("Donation placement failed:", response.data.message);
        alert("Donate Failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Donation placement error:", error);
      alert(
        "Donate Failed: " +
          (error.response?.data?.message || "Unknown error occurred")
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full bg-white rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row">
          {/* Form section */}
          <form
            onSubmit={donate}
            className="rounded-lg p-36 pr-96 bg-slate-200 md:w-2/3 md:mr-4"
          >
            <h2 className="mb-8 text-3xl font-semibold text-gray-800">
              Your Information
            </h2>
            <div className="flex flex-col gap-4 mb-4 md:flex-row">
              <input
                name="first_name"
                onChange={onChangeHandler}
                value={data.first_name}
                type="text"
                placeholder="First Name"
                className="w-full p-3 border border-orange-400 rounded-lg"
              />
              <input
                name="last_name"
                onChange={onChangeHandler}
                value={data.last_name}
                type="text"
                placeholder="Last Name"
                className="w-full p-3 border border-orange-400 rounded-lg"
              />
            </div>
            <input
              required
              name="email"
              onChange={onChangeHandler}
              value={data.email}
              type="email"
              placeholder="Email Address"
              className="w-full p-3 mb-4 border border-orange-400 rounded-lg"
            />
            <textarea
              required
              name="address"
              onChange={onChangeHandler}
              value={data.address}
              placeholder="Address"
              className="w-full p-3 mb-4 border border-orange-400 rounded-lg"
            />
            <div className="flex flex-col gap-4 mb-4 md:flex-row">
              <input
                name="nic"
                onChange={onChangeHandler}
                value={data.nic}
                type="text"
                placeholder="NIC Number"
                className="w-full p-3 border border-orange-400 rounded-lg"
              />
              <select
                required
                name="country"
                onChange={onChangeHandler}
                value={data.country}
                className="w-full p-3 border border-orange-400 rounded-lg"
              >
                <option value="">Select a country</option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <input
              name="phone"
              onChange={onChangeHandler}
              value={data.phone}
              type="text"
              placeholder="Phone Number"
              className="w-full p-3 mb-4 border border-orange-400 rounded-lg"
            />
            <input
              required
              name="amount"
              onChange={onChangeHandler}
              value={data.amount}
              type="number"
              placeholder="Donate Amount"
              className="w-full p-3 mb-4 border border-orange-400 rounded-lg md:w-1/3"
            />
            <div className="">
              <button
                type="submit"
                className="w-1/2 px-6 py-3 text-white transition-all duration-300 bg-orange-500 rounded-lg hover:bg-orange-600"
              >
                Donate Now
              </button>
            </div>
          </form>

          {/* Image section */}
          <div className="w-full mt-6 md:w-1/3 md:mt-0">
            <img
              src="https://cdn.pixabay.com/photo/2021/01/29/17/24/hand-5961661_1280.jpg"
              alt="Donate"
              className="object-cover w-full h-full rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
