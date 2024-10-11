import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { RiCloseLargeFill } from 'react-icons/ri';
import PrimaryButton from './elements/PrimaryButton';

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
        childname: application.child.name,
        parentid: application.application.userid,
        parentname: application.application.username,
        socialworkerid: socialworkerid,
        applicationid: application.applicationid

      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status) {
        console.log("Case created successfully");

      }
    } catch (error) {
      console.log(error);
    }

    closeModal();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md  py-20 ">
      <div
        id="scrollview"
        className="bg-white drop-shadow-lg w-full h-fit mt-10 mx-10 border rounded-lg">

        <div className='flex flex-row justify-between my-auto mx-5'>
          <h1 className="text-2xl font-bold text-center my-5 relative text-orange-600"> Assign Social Worker</h1>
          <RiCloseLargeFill
            onClick={closeModal}
            className='bg-red-500 rounded-full text-4xl p-2 text-white drop-shadow hover:bg-red-700 my-auto' />
        </div>

        <div id="report" className="w-full  h-[75vh] overflow-y-auto px-10 bg-slate-50">
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

          <h2 className="text-2xl font-semibold text-gray-800 my-5"> Assign a social worker:</h2>


          {showSocialWorkerAssign && (
            <div className="px-10 py-8 bg-white shadow-lg rounded-lg my-5" id="swtocase">

              <div className="overflow-x-auto">


                {socialWorkerList && socialWorkerList.length > 0 ? (
                  <div >
                    <table className="table">
                      {/* head */}
                      <thead>
                        <tr>
                          <th></th>
                          <th>Social Worker</th>
                          <th ></th>
                        </tr>
                      </thead>
                      <tbody>
                        {socialWorkerList.map((sw, index) => (

                          <tr key={index}>
                            <th>{index + 1}</th>
                            <td>{sw.username}</td>
                            <td className='flex flex-row justify-end'>
                              <PrimaryButton onClick={() => assignToCase(sw.socialworkerid)} text={'Assign'} disabled={application.status === 'Accepted'} />
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
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default ApplicationModal;
