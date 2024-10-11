import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import toast from 'react-hot-toast';
import { ConfirmationModal } from './ConfirmationModal';
import { RiCloseLargeFill } from 'react-icons/ri';
import PrimaryButton from './elements/PrimaryButton';

const NAME_REGEX = /^[a-zA-Z. ]{0,99}[a-zA-Z]$/;
const GENDER_REGEX = /^(Male|Female)$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const COMMON_REGEX = /^[a-zA-Z0-9 ]{2,10}$/;

const ChildEditForm = ({ setEditVisibility, child, setChild, imageURL, setImageURL, avatarPlaceHolder }) => {
    const axiosPrivate = useAxiosPrivate()
    const today = new Date().toISOString().split('T')[0];
    const dobFormatted = new Date(child.date_of_birth).toISOString().split('T')[0];

    const [name, setName] = useState(child.name);
    const [dateOfBirth, setDateOfBirth] = useState(dobFormatted);
    const [gender, setGender] = useState(child.gender);
    const [nationality, setNationality] = useState(child.nationality);
    const [religion, setReligion] = useState(child.religion);
    const [medicalDetails, setMedicalDetails] = useState(child.medicaldetails);
    const [educationalDetails, setEducationalDetails] = useState(child.educationaldetails);

    const [validName, setValidName] = useState(false);
    const [validDateOfBirth, setValidDateOfBirth] = useState(false);
    const [validGender, setValidGender] = useState(false);
    const [validNationality, setValidNationality] = useState(false);
    const [validReligion, setValidReligion] = useState(false);

    const [changedName, setChangedName] = useState(false);
    const [changedDateOfBirth, setChangedDateOfBirth] = useState(false);
    const [changedGender, setChangedGender] = useState(false);
    const [changedNationality, setChangedNationality] = useState(false);
    const [changedReligion, setChangedReligion] = useState(false);
    const [changedMedicalDetails, setChangedMedicalDetails] = useState(false);
    const [changedEducationalDetails, setChangedEducationalDetails] = useState(false);

    const [confirmModelVisibility, setConfirmModelVisibility] = useState(false);
    const [image, setImage] = useState(null);

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setValidName(NAME_REGEX.test(name));
        setChangedName(child.name !== name);
    }, [name, child.name]);

    useEffect(() => {
        setValidDateOfBirth(DATE_REGEX.test(dateOfBirth));
        setChangedDateOfBirth(dobFormatted !== dateOfBirth);
    }, [dateOfBirth, dobFormatted]);

    useEffect(() => {
        setValidGender(GENDER_REGEX.test(gender));
        setChangedGender(child.gender !== gender)
    }, [gender, child.gender]);

    useEffect(() => {
        setValidNationality(COMMON_REGEX.test(nationality));
        setChangedNationality(child.nationality !== nationality)
    }, [nationality, child.nationality]);

    useEffect(() => {
        setValidReligion(COMMON_REGEX.test(religion));
        setChangedReligion(child.religion !== religion)
    }, [religion, child.religion]);

    useEffect(() => {
        setChangedMedicalDetails(child.medicaldetails !== medicalDetails)
    }, [medicalDetails, child.medicaldetails])

    useEffect(() => {
        setChangedEducationalDetails(child.educationaldetails !== educationalDetails)
    }, [educationalDetails, child.educationaldetails])

    const submitEligibility = () => {
        if ((validName && validDateOfBirth && validGender && validNationality && validReligion) &&
            (changedName || changedDateOfBirth || changedGender || changedNationality || changedReligion || changedMedicalDetails || changedEducationalDetails)) {
            return true;
        }
        return false;
    }


    const updateChild = async () => {
        const data = {
            childid: child.childid,
            name,
            date_of_birth: dateOfBirth,
            gender,
            religion,
            nationality,
            medicaldetails: medicalDetails,
            educationaldetails: educationalDetails
        }

        try {
            const response = await axiosPrivate.post(`/request/editChild`, data)
            toast.success(response.data.message);
            return true

        } catch (error) {
            toast.error(error.response.data);
            return false
        }
    }

    const handleConfirmation = async () => {
        setLoading(true)
        setConfirmModelVisibility(false);
        await updateChild();
        setEditVisibility(false);
        setLoading(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setConfirmModelVisibility(true);
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md py-20 ">
            <section className=" px-8 py-4 mx-auto bg-white rounded-md shadow-lg my-5 max-w-3xl border">

                <div className="flex flex-row justify-between">
                    <h2 className="m-4 text-2xl font-semibold text-gray-800 flex flex-row">Edit profile of <p className='text-orange-500 mx-2'> {child.name} </p></h2>
                    {/* close button */}
                    <div className='flex flex-row justify-end my-auto ml-5'>
                        <RiCloseLargeFill
                            onClick={() => setEditVisibility(false)}
                            className='bg-red-500 rounded-full text-4xl p-2 text-white drop-shadow hover:bg-red-700' />
                    </div>
                </div>

                <div className="overflow-y-auto max-h-[80vh]">
                    <form>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                            <img className="w-64 h-64 my-auto p-10 rounded-full md:rounded-full mx-auto col-span-1 sm:col-span-4" src={imageURL ? imageURL : avatarPlaceHolder} alt="ERROR" />
                            <div className="col-span-1 sm:col-span-2 ">
                                <label className="text-gray-700" htmlFor="name">Name of the child {!validName ? <span className='text-red-500 text-xs'>*invalid</span> : changedName ? <span className='text-green-500 text-xs'>valid</span> : <span className='text-blue-500 text-xs'>unchanged</span>}</label>
                                <input value={name} onChange={(e) => { setName(e.target.value) }} id="name" type="text" className="block w-full px-3 py-1 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-orange-500 focus:outline-none" />
                            </div>
                            <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                                <label className="text-gray-700" htmlFor="date_of_birth">Date of Birth  {!validDateOfBirth ? <span className='text-red-500 text-xs'>*invalid</span> : changedDateOfBirth ? <span className='text-green-500 text-xs'>valid</span> : <span className='text-blue-500 text-xs'>unchanged</span>}</label>
                                <input value={dateOfBirth} onChange={(e) => { setDateOfBirth(e.target.value) }} id="date_of_birth" type="date" max={today} className="block w-full px-3 py-1 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-orange-500 focus:outline-none" />
                            </div>
                            <div className="col-span-1">
                                <label className="text-gray-700" htmlFor="gender">Gender  {!validGender ? <span className='text-red-500 text-xs'>*invalid</span> : changedGender ? <span className='text-green-500 text-xs'>valid</span> : <span className='text-blue-500 text-xs'>unchanged</span>}</label>
                                <select value={gender} onChange={(e) => { setGender(e.target.value) }} id="gender" className="block w-full px-3 py-1 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-orange-500 focus:outline-none">
                                    <option>Select</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="text-gray-700" htmlFor="nationality">Nationality  {!validNationality ? <span className='text-red-500 text-xs'>*invalid</span> : changedNationality ? <span className='text-green-500 text-xs'>valid</span> : <span className='text-blue-500 text-xs'>unchanged</span>}</label>
                                <input value={nationality} onChange={(e) => { setNationality(e.target.value) }} id="nationality" type="text" className="block w-full px-3 py-1 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-orange-500 focus:outline-none" />
                            </div>
                            <div className="col-span-1 sm:col-span-2 ">
                                <label className="text-gray-700" htmlFor="religion">Religion  {!validReligion ? <span className='text-red-500 text-xs'>*invalid</span> : changedReligion ? <span className='text-green-500 text-xs'>valid</span> : <span className='text-blue-500 text-xs'>unchanged</span>}</label>
                                <input value={religion} onChange={(e) => { setReligion(e.target.value) }} id="religion" type="text" className="block w-full px-3 py-1 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-orange-500 focus:outline-none" />
                            </div>
                            <div className="col-span-1 sm:col-span-2 ">
                                <label className="text-gray-700" htmlFor="medicaldetails">Medical Details  {changedMedicalDetails ? <span className='text-green-500 text-xs'>valid</span> : <span className='text-blue-500 text-xs'>unchanged</span>}</label>
                                <textarea value={medicalDetails} onChange={(e) => { setMedicalDetails(e.target.value) }} id="medicaldetails" className="resize-none block w-full px-3 py-1 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-orange-500 focus:outline-none"></textarea>
                            </div>
                            <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                                <label className="text-gray-700" htmlFor="educationaldetails">Educational Details  {changedEducationalDetails ? <span className='text-green-500 text-xs'>valid</span> : <span className='text-blue-500 text-xs'>unchanged</span>}</label>
                                <textarea value={educationalDetails} onChange={(e) => { setEducationalDetails(e.target.value) }} id="educationaldetails" className="resize-none block w-full px-3 py-1 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-orange-500 focus:outline-none"></textarea>
                            </div>

                        </div>
                        <div className="flex justify-end mt-4">
                            <PrimaryButton
                                disabled={!submitEligibility()}
                                text={'submit'}
                                onClick={handleSubmit}
                                loading={loading}
                            />
                        </div>
                    </form>
                </div>
            </section>

            {confirmModelVisibility && <ConfirmationModal head='Child Update Request' body='Are you sure you want to create a update child request' handleConfirmation={handleConfirmation} setVisibility={setConfirmModelVisibility} />}
        </div >
    )
}

export default ChildEditForm