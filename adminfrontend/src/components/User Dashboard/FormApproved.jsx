import React, { useEffect, useState } from 'react'
import { MdOutlineDone } from "react-icons/md";
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import toast from 'react-hot-toast';
import ProgressBar from './ProgressBar';

const FormApproved = ({ application, setCurrentState }) => {
    const axiosPrivate = useAxiosPrivate()
    const [children, setChildren] = useState([])
    const [selectedChild, setSelectedChild] = useState(null)

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const response = await axiosPrivate.post('/application/getchildren', {
                    agerange: application.agerange,
                    gender: application.genderofchild
                })
                setChildren(response.data.children)
            } catch (error) {
                console.error('Failed to fetch children:', error)
            }
        }
        fetchChildren()
    }, [axiosPrivate, application.agerange, application.genderofchild])


    const handleSelectChild = (child) => {
        setSelectedChild(child)
    }

    const handleProceedWithAdoption = async () => {
        if (selectedChild) {
            try {

                const response = await axiosPrivate.post('/application/approve', {
                    applicationId: application.applicationid,
                    childId: selectedChild.childid,
                    parentId: application.userid
                })

                if (response.status === 201) {
                    console.log('Proceeding with adoption for child:', selectedChild);
                    toast.success('Successful')
                    setCurrentState(4)
                } else {
                    console.error('Failed to proceed with adoption:', response.data.message);
                }



            } catch (error) {
                console.error('Error proceeding with adoption:', error);
            }
        }
    }

    return (
        <div>
            <div className="flex flex-col items-center w-3/5 text-center mx-auto">
                <ProgressBar step={3} />
                <h1 className='font-bold text-4xl sm:text-5xl mt-10'>
                    <p className='text-orange-500 mb-1'>
                        Congratulations!</p>
                    Your Fostering Application
                    Has Been Approved
                    <MdOutlineDone className='text-white bg-green-500 rounded-full mx-auto mt-5' /></h1>
            </div>
            <div className="flex flex-col text-center mt-10 text-lg">
                <h1 className='font-bold text-4xl'>Whats next?</h1>
                <p >Based on your preferences and the best interests of the children in our care,
                    we have selected suitable children for your family</p>
                <p className='font-bold text-orange-600'>Now you have to select a child from given choices. you can contact relevant orphanages for further information</p>
            </div>


            <div id="scrollview" className="my-5">
                <div className="w-full border h-[80vh] overflow-y-auto p-6">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Matching Children per your criteria:</h3>
                        {children.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {children.map((child) => (
                                    <div
                                        key={child.childid}
                                        className={`p-6 border rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${selectedChild && selectedChild.childid === child.childid ? 'border-primary shadow-lg bg-[#fad4c8]' : 'border-gray-300 bg-white'}`}
                                        onClick={() => handleSelectChild(child)}
                                    >
                                        <img
                                            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                            alt="Child"
                                            className="w-24 h-24 object-cover rounded-full mb-4 mx-auto shadow-md"
                                        />
                                        <h4 className="text-lg font-semibold text-center text-gray-800">{child.name}</h4>
                                        <p className="text-center text-gray-600 mt-2">Orphanage: {child.orphanage.orphanagename}</p>
                                    </div>
                                ))}
                            </div>

                        ) : (
                            <p className="text-center text-gray-600">No children found matching the criteria.</p>
                        )}
                    </div>
                </div>
                <div className="flex justify-end p-6">
                    <button
                        onClick={handleProceedWithAdoption}
                        className={`my-10 items-center justify-center w-72 border-2 px-4 py-3 text-xl flex gap-3 transition-all duration-300 group text-center ${selectedChild ? 'text-primary border-primary bg-white hover:gap-5 hover:text-white hover:bg-primary' : 'text-gray-300 border-gray-300  cursor-not-allowed'}`}
                        disabled={!selectedChild}
                    >
                        Proceed with Adoption
                    </button>
                </div>
            </div>

        </div>

    )
}

export default FormApproved