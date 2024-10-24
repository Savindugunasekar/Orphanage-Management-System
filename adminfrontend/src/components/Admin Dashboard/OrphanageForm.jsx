import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import PrimaryButton from "../elements/PrimaryButton";
import { RiCloseLargeFill } from "react-icons/ri";
import toast from "react-hot-toast";


const NAME_REGEX = /^[A-Za-z\s]+$/;
const ADDRESS_REGEX = /^[A-Za-z0-9\s,./-]+$/;
const CAPACITY_REGEX = /^(?:[1-9]\d{0,2}|101)$/;
const TELNO_REGEX = /^\d{10}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const OrphanageForm = ({ setOrphanageForm, getAllOrphanages }) => {
  const axiosPrivate = useAxiosPrivate();

  const [validName, setValidName] = useState(false);
  const [validAddress, setValidAddress] = useState(false);
  const [validCapacity, setValidCapacity] = useState(false);
  const [validTelno, setValidTelno] = useState(false);
  const [validHead_email, setValidHead_email] = useState(false);
  const [validDistrict, setValidDistrict] = useState(false);

  const warningText = {
    name: "Only letters allowed",
    address: "Use letters and numbers",
    capacity: "Enter a number (1-100)",
    telno: "Must be 10 digits",
    head_email: "Invalid email",
    district: "Select a district"
  };



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
        await getAllOrphanages();
        console.log("Orphanage added successfully");
        toast.success("Orphanage added successfully");
        setOrphanageForm(false);  // Close the form after successful submission

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

  useEffect(() => {
    setValidDistrict(districts.includes(orphanageDetails.district));
  }, [orphanageDetails.district]);

  return (
    <div className="fixed inset-0 flex items-center justify-center py-20 backdrop-blur-sm ">
      <div
        id="scrollview"
        className="w-full mx-10 mt-10 bg-white border rounded drop-shadow-lg h-fit">

        <div className='flex flex-row justify-between mx-5 my-auto'>
          <h1 className="relative my-5 text-2xl font-bold text-center">
            Submit New Orphanage
          </h1>
          {/* close button */}

          <RiCloseLargeFill
            onClick={() => setOrphanageForm(false)}
            className='p-2 my-auto text-4xl text-white bg-red-500 rounded-full drop-shadow hover:bg-red-700' />
        </div>

        <div id="report" className="w-full  h-[45vh] overflow-y-auto px-10">
          <form className="flex flex-col gap-5" >
            <div className="flex flex-col gap-5 md:flex-row">
              <div className="flex flex-col w-full">
                <label className="mb-3 font-semibold text-md" htmlFor="orphanagename">
                  Orphanage Name: {!validName && <span className='text-red-500 text-xs'>{warningText.name}</span>}
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
                  Orphanage Address: {!validAddress && <span className='text-red-500 text-xs'>{warningText.address}</span>}
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
                  Orphanage Capacity: {!validCapacity && <span className='text-red-500 text-xs'>{warningText.capacity}</span>}
                </label>
                <input
                  className="w-full bg-gray-100 h-[40px] rounded-md px-4 py-3 border-none focus-visible:ring-primary !important"
                  type="number"
                  onChange={detailHandler}
                  id="capacity"
                  name="capacity"
                  value={orphanageDetails.capacity}
                  min="1"
                  max="100"
                  required
                />
              </div>

              <div className="flex flex-col w-full">
                <label className="mb-3 font-semibold text-md" htmlFor="telno">
                  Orphanage Tel Number: {!validTelno && <span className='text-red-500 text-xs'>{warningText.telno}</span>}
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
                  Assign Head Email: {!validHead_email && <span className='text-red-500 text-xs'>{warningText.head_email}</span>}
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
              <label className="mb-3 font-semibold text-md" htmlFor="district">
                Orphanage District: {!validDistrict && <span className='text-red-500 text-xs'> *required</span>}
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

          </form>
        </div>
        <div className="flex flex-row justify-end m-5">
          <PrimaryButton
            onClick={addOrphanage}
            text={'Submit'}
            disabled={!validName || !validAddress || !validCapacity || !validHead_email || !validTelno || !validDistrict} />
        </div>
      </div>
    </div>
  );
};

export default OrphanageForm;
