import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import toast from 'react-hot-toast';
import { ConfirmationModal } from './ConfirmationModal';

const NAME_REGEX = /^[a-zA-Z. ]{0,99}[a-zA-Z]$/;
const GENDER_REGEX = /^(Male|Female)$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const COMMON_REGEX = /^[a-zA-Z0-9 ]{2,10}$/;


export const ChildAddFormStep1 = ({ setTab, tabs, setReqId }) => {

    const { id } = useParams();
    const axiosPrivate = useAxiosPrivate()

    const [name, setName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [nationality, setNationality] = useState('');
    const [religion, setReligion] = useState('');
    const [medicalDetails, setMedicalDetails] = useState('');
    const [educationalDetails, setEducationalDetails] = useState('');

    const [validName, setValidName] = useState(false);
    const [validDateOfBirth, setValidDateOfBirth] = useState(false);
    const [validGender, setValidGender] = useState(false);
    const [validNationality, setValidNationality] = useState(false);
    const [validReligion, setValidReligion] = useState(false);

    const [confirmModalVisibility, setConfirmModalVisibility] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        setValidName(NAME_REGEX.test(name));
    }, [name]);

    useEffect(() => {
        setValidDateOfBirth(DATE_REGEX.test(dateOfBirth));
    }, [dateOfBirth]);

    useEffect(() => {
        setValidGender(GENDER_REGEX.test(gender));
    }, [gender]);

    useEffect(() => {
        setValidNationality(COMMON_REGEX.test(nationality));
    }, [nationality]);

    useEffect(() => {
        setValidReligion(COMMON_REGEX.test(religion));
    }, [religion]);

    const clearForm = () => {
        setName('');
        setDateOfBirth('');
        setGender('Select');
        setNationality('');
        setReligion('');
        setMedicalDetails('');
        setEducationalDetails('');
    }

    const addChild = async () => {
        const data = {
            orphanageid: id,
            name,
            date_of_birth: dateOfBirth,
            gender,
            religion,
            nationality,
            medicaldetails: medicalDetails,
            educationaldetails: educationalDetails
        }

        try {
            const response = await axiosPrivate.post('/request/addChild', data)
            await setReqId(response.data.data.requestid)
            toast.success(response.data.message)
            return true
        } catch (error) {
            toast.error(error.response.data)
        }
    }

    const handleConfirmation = async () => {
        const response = await addChild();
        setConfirmModalVisibility(false);
        if (response) {
            clearForm();
            setTab(tabs[1]);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setConfirmModalVisibility(true);
    }

    return (

        <div className=' grid grid-rows-12'>
            <div className=" row-span-10 overflow-y-auto h-[60vh] mt-5">
                <form>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                        <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                            <label className="text-gray-700" htmlFor="name">Name of the child {!validName && <span className='text-red-500 text-xs'> *required</span>}</label>
                            <input value={name} onChange={(e) => { setName(e.target.value) }} id="name" type="text" className="block w-full px-3 py-1 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-orange-500 focus:outline-none" />
                        </div>
                        <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                            <label className="text-gray-700" htmlFor="date_of_birth">Date of Birth {!validDateOfBirth && <span className='text-red-500 text-xs'> *required</span>}</label>
                            <input value={dateOfBirth} onChange={(e) => { setDateOfBirth(e.target.value) }} id="date_of_birth" type="date" max={today} className="block w-full px-3 py-1 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-orange-500 focus:outline-none" />
                        </div>
                        <div className="col-span-1">
                            <label className="text-gray-700" htmlFor="gender">Gender {!validGender && <span className='text-red-500 text-xs'> *required</span>}</label>
                            <select value={gender} onChange={(e) => { setGender(e.target.value) }} id="gender" className="block w-full px-3 py-1 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-orange-500 focus:outline-none">
                                <option>Select</option>
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                        </div>
                        <div className="col-span-1">
                            <label className="text-gray-700" htmlFor="nationality">Nationality {!validNationality && <span className='text-red-500 text-xs'> *required</span>}</label>
                            <input value={nationality} onChange={(e) => { setNationality(e.target.value) }} id="nationality" type="text" className="block w-full px-3 py-1 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-orange-500 focus:outline-none" />
                        </div>
                        <div className="col-span-1 sm:col-span-2 ">
                            <label className="text-gray-700" htmlFor="religion">Religion {!validReligion && <span className='text-red-500 text-xs'> *required</span>}</label>
                            <input value={religion} onChange={(e) => { setReligion(e.target.value) }} id="religion" type="text" className="block w-full px-3 py-1 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-orange-500 focus:outline-none" />
                        </div>
                        <div className="col-span-1 sm:col-span-2 ">
                            <label className="text-gray-700" htmlFor="medicaldetails">Medical Details</label>
                            <textarea value={medicalDetails} onChange={(e) => { setMedicalDetails(e.target.value) }} id="medicaldetails" className="resize-none block w-full px-3 py-1 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-orange-500 focus:outline-none"></textarea>
                        </div>
                        <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                            <label className="text-gray-700" htmlFor="educationaldetails">Educational Details</label>
                            <textarea value={educationalDetails} onChange={(e) => { setEducationalDetails(e.target.value) }} id="educationaldetails" className="resize-none block w-full px-3 py-1 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-orange-500 focus:outline-none"></textarea>
                        </div>

                    </div>

                </form>

            </div>
            <div className="row-span-2 flex justify-end ">
                <button
                    onClick={handleSubmit}
                    disabled={!(validName && validDateOfBirth && validGender && validNationality && validReligion)}
                    className="h-fit my-auto items-end bg-transparent hover:bg-orange-500 text-orange-500 font-semibold hover:text-white py-2 px-4 border border-orange-500 hover:border-transparent rounded disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300 disabled:cursor-not-allowed">
                    Submit & Next
                </button>
            </div>
            {confirmModalVisibility && <ConfirmationModal head="Add Child Request" body="Are you sure you want to create add child request?" handleConfirmation={handleConfirmation} setVisibility={setConfirmModalVisibility} />}
        </div>
    )
}
