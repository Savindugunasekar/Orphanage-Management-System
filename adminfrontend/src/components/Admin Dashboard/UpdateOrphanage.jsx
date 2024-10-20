import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useParams } from "react-router-dom";
import { RiCloseLargeFill } from "react-icons/ri";
import PrimaryButton from "../elements/PrimaryButton";

const NAME_REGEX = /^[A-Za-z\s]+$/;
const ADDRESS_REGEX = /^[A-Za-z0-9\s,./-]+$/;
const CAPACITY_REGEX = /^(?:[1-9]\d{0,2}|101)$/;
const TELNO_REGEX = /^\d{10}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UpdateOrphanage = ({ id, setUpdateForm, getAllOrphanages }) => {
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(false)


  const [validName, setValidName] = useState(false);
  const [validAddress, setValidAddress] = useState(false);
  const [validCapacity, setValidCapacity] = useState(false);
  const [validTelno, setValidTelno] = useState(false);
  const [validHead_email, setValidHead_email] = useState(false);

  const warningText = {
    name: "Only letters allowed",
    address: "Use letters and numbers",
    capacity: "Enter a number (1-100)",
    telno: "Must be 10 digits",
    head_email: "Invalid email",
    district: "Select a district"
  };

  const [orphanageDetails, setOrphanageDetails] = useState({
    orphanagename: "",
    address: "",
    capacity: 0,
    telno: "",
    head_email: "",
    // New state field for district
  });

  useEffect(() => {
    // Define an async function inside the useEffect
    console.log(id); // Use the destructured variable directly
    console.log("useEffect works");

    const fetchOrphanageDetails = async () => {
      try {
        const response = await axiosPrivate.get(`/orphanage/${id}`);
        console.log(response);
        setOrphanageDetails({
          orphanagename: response.data.data.orphanagename,
          address: response.data.data.address,
          capacity: response.data.data.capacity,
          telno: response.data.data.telno,
          head_email: response.data.data.head_email,
        });
        console.log(orphanageDetails);
      } catch (error) {
        console.error("Failed to fetch orphanage details:", error);
      }
    };

    fetchOrphanageDetails();
  }, [id]);

  // Handler to update the state when input changes
  const detailHandler = (e) => {
    setOrphanageDetails({
      ...orphanageDetails,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle form submission using axios
  const updatingOrphanage = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      console.log("Request ID:", id); // Debug line
      console.log("Request Body:", orphanageDetails); // Debug line
      const response = await axiosPrivate.put(
        `/orphanage/${id}`,
        orphanageDetails,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        await getAllOrphanages();
        console.log("Orphanage Updated successfully");

        // Reset form fields
        setOrphanageDetails({
          orphanagename: "",
          address: "",
          capacity: 0,
          telno: "",
          head_email: "", // Reset district as well
        });
      } else {
        console.error("Failed to Update orphanage");
      }
      setLoading(false)
      setUpdateForm(false)
    } catch (error) {
      setLoading(false)
      console.log(error);
      setUpdateForm(false)
    }
  };

  useEffect(() => {
    setValidName(new RegExp(NAME_REGEX).test(orphanageDetails.orphanagename));
  }, [orphanageDetails.orphanagename]);

  useEffect(() => {
    setValidAddress(new RegExp(ADDRESS_REGEX).test(orphanageDetails.address));
  }, [orphanageDetails.address]);

  useEffect(() => {
    setValidCapacity(new RegExp(CAPACITY_REGEX).test(orphanageDetails.capacity));
  }, [orphanageDetails.capacity]);

  useEffect(() => {
    setValidTelno(new RegExp(TELNO_REGEX).test(orphanageDetails.telno));
  }, [orphanageDetails.telno]);

  useEffect(() => {
    setValidHead_email(new RegExp(EMAIL_REGEX).test(orphanageDetails.head_email));
  }, [orphanageDetails.head_email]);



  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm py-20 ">
      <div
        id="scrollview"
        className="bg-white rounded drop-shadow-lg w-full h-fit mt-10 mx-10 border">
        <div className="flex flex-row justify-between">
          <h2 className="m-4 text-2xl font-semibold text-gray-800">Update Orphanage</h2>
          {/* close button */}
          <div className='flex flex-row justify-end my-auto mx-5'>
            <RiCloseLargeFill
              onClick={() => setUpdateForm(false)}
              className='bg-red-500 rounded-full text-4xl p-2 text-white drop-shadow hover:bg-red-700' />
          </div>
        </div>

        <form className="flex flex-col gap-5  w-full  h-[40vh] overflow-y-auto p-6 pb-0" onSubmit={updatingOrphanage}>
          <div className="flex flex-col gap-5 md:flex-row">
            <div className="flex flex-col w-full">
              <label
                className="mb-3 font-semibold text-md"
                htmlFor="orphanagename"
              >
                Orphanage Name:{!validName && <span className='text-red-500 text-xs'>{warningText.orphanagename}</span>}
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
              <label className="mb-3 font-semibold text-md" htmlFor="address">
                Address:{!validAddress && <span className='text-red-500 text-xs'>{warningText.address}</span>}
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
              <label className="mb-3 font-semibold text-md" htmlFor="capacity">
                Capacity:{!validCapacity && <span className='text-red-500 text-xs'>{warningText.capacity}</span>}
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
              <label className="mb-3 font-semibold text-md" htmlFor="telno">
                Tel Number: {!validTelno && <span className='text-red-500 text-xs'>{warningText.telno}</span>}
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
              <label className="mb-3 font-semibold text-md" htmlFor="head_email">
                Head Email: {!validHead_email && <span className='text-red-500 text-xs'>{warningText.head_email}</span>}
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

          {/* <div className="flex flex-col w-full">
          <label className="mb-3 font-semibold text-md" htmlFor="district">
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
        </div> */}


        </form>
        <div className="flex flex-row justify-end">
          <PrimaryButton
            onClick={updatingOrphanage}
            text={'Update Orphanage'}
            className={'m-10'}
            loading={loading}
            disabled={!validName || !validAddress || !validCapacity || !validHead_email || !validTelno} />
        </div>

      </div>
    </div>
  );
};

export default UpdateOrphanage;
