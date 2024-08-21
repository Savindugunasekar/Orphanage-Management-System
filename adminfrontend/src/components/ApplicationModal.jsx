import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate'

const ApplicationModal = ({ application, closeModal, socialWorkerList = [] }) => {
    const [showSocialWorkerAssign, setShowSocialWorkerAssign] = useState(true);
    const axiosPrivate = useAxiosPrivate();

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const assignToCase = async (socialworkerid) => {
        try {
            const response = await axiosPrivate.post('/case', {
                childid: application.child.childid,
                parentid: application.application.userid,
                socialworkerid: socialworkerid,
               
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.status) {
                console.log("Case created successfully");
                closeModal(); // Close modal after successful assignment
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='fixed inset-0 backdrop-blur-sm flex justify-center items-center'>
            <div id='scrollview' className='bg-white rounded shadow-lg w-[95%] h-[95vh] overflow-y-auto'>
                
                <div className='w-full bg-red-200 h-[80vh]'>
                <div id="report" className="w-full bg-gray-50 h-[80vh] overflow-y-auto p-6">
                <h1 className="text-3xl text-primary font-extrabold text-center mb-6">Assign Social Worker</h1>
  <h2 className="text-2xl font-semibold text-gray-800 mb-4"> Details of Applicant:</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <p className="font-medium text-gray-700">First Name:</p>
      <p className="text-gray-600">{application.application.firstname}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <p className="font-medium text-gray-700">Last Name:</p>
      <p className="text-gray-600">{application.application.lastname}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <p className="font-medium text-gray-700">Email Address:</p>
      <p className="text-gray-600">{application.application.emailaddress}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <p className="font-medium text-gray-700">Date of Birth:</p>
      <p className="text-gray-600">{application.application.dob}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <p className="font-medium text-gray-700">Gender:</p>
      <p className="text-gray-600">{application.application.gender}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <p className="font-medium text-gray-700">NIC:</p>
      <p className="text-gray-600">{application.application.nic}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <p className="font-medium text-gray-700">Occupation:</p>
      <p className="text-gray-600">{application.application.occupation}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <p className="font-medium text-gray-700">Nationality:</p>
      <p className="text-gray-600">{application.application.nationality}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <p className="font-medium text-gray-700">Religion:</p>
      <p className="text-gray-600">{application.application.religion}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <p className="font-medium text-gray-700">Number of Family Members:</p>
      <p className="text-gray-600">{application.application.nooffamilymembers}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <p className="font-medium text-gray-700">Monthly Income:</p>
      <p className="text-gray-600">{application.application.monthlyincome.toFixed(2)}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <p className="font-medium text-gray-700">Home Address:</p>
      <p className="text-gray-600">{application.application.homeaddress}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <p className="font-medium text-gray-700">City:</p>
      <p className="text-gray-600">{application.application.city}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <p className="font-medium text-gray-700">Province:</p>
      <p className="text-gray-600">{application.application.province}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <p className="font-medium text-gray-700">Postal Code:</p>
      <p className="text-gray-600">{application.application.postalcode}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <p className="font-medium text-gray-700">Telephone Number:</p>
      <p className="text-gray-600">{application.application.telphonenum}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <p className="font-medium text-gray-700">Cellphone Number:</p>
      <p className="text-gray-600">{application.application.cellphonenum}</p>
    </div>
  </div>

  <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Child Details:</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <p className="font-medium text-gray-700">Gender of Child:</p>
      <p className="text-gray-600">{application.application.genderofchild}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <p className="font-medium text-gray-700">Name of Child:</p>
      <p className="text-gray-600">{application.child.name}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <p className="font-medium text-gray-700">Date of Birth:</p>
      <p className="text-gray-600">{application.child.date_of_birth}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <p className="font-medium text-gray-700">Nationality:</p>
      <p className="text-gray-600">{application.child.nationality}</p>
    </div>
    
  </div>

  
  {showSocialWorkerAssign && (
                    <div className="px-10 py-8 bg-white shadow-lg rounded-lg mt-5" id="swtocase">
                   
                    {socialWorkerList && socialWorkerList.length > 0 ? (
                      <div >
                        <table className="min-w-full bg-white border-y border-gray-200 rounded-lg">
                          <tbody>
                            {socialWorkerList.map((sw) => (
                              <tr key={sw.socialworkerid} className="hover:bg-gray-100 transition-colors duration-200">
                                <td className="p-4 text-left border-b border-gray-200">
                                  <span className="text-lg font-medium">{sw.username}</span>
                                </td>
                                <td className="p-4 text-right border-b border-gray-200">
                                  <button
                                    className="bg-primary text-white px-5 py-2 rounded-full hover:bg-primary-dark transition-colors duration-200"
                                    onClick={() => assignToCase(sw.socialworkerid)}
                                  >
                                    Assign
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-red-500 text-center text-lg font-semibold">No social workers available</p>
                    )}
                  </div>
                  
                )}
 
    
</div>
                    
                </div>

            </div>
        </div>
    );
};

export default ApplicationModal;
