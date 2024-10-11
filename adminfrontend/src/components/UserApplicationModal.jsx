import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

export const UserApplicationModal = ({ application, closeModal }) => {
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

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            closeModal()
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

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
                    closeModal();
                } else {
                    console.error('Failed to proceed with adoption:', response.data.message);
                }



            } catch (error) {
                console.error('Error proceeding with adoption:', error);
            }
            closeModal()
        }
    }

    return (
        <div >
            <div id="scrollview" className="bg-white rounded-lg shadow-xl w-[95%] h-[95vh]">
                <div className="w-full  h-[80vh] overflow-y-auto p-6">
                    <h1 className="text-2xl font-bold text-center text-primary mb-4">Your application has been accepted!</h1>
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
                <div className="flex justify-between p-6">
                    <button onClick={closeModal} className="bg-gray-300 text-gray-700 p-3 rounded-lg transition-all duration-300 hover:bg-gray-400">Close</button>
                    <button
                        onClick={handleProceedWithAdoption}
                        className={`p-3 rounded-lg transition-all duration-300 ${selectedChild ? 'bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        disabled={!selectedChild}
                    >
                        Proceed with Adoption
                    </button>
                </div>
            </div>

        </div>
    )
}
