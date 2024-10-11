import React, { useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { RiCloseLargeFill } from "react-icons/ri";
import PrimaryButton from "../elements/PrimaryButton";

const ApplicationModalAdmin = ({ application, closeModal }) => {
  const axiosPrivate = useAxiosPrivate();

  const handleAccept = async () => {
    try {





      const response = await axiosPrivate.put(
        `/application?applicationid=${application.applicationid}&status=Accepted`
      );
      // Handle response if needed
    } catch (error) {
      console.error("Failed to accept application:", error);
    }
    closeModal();
  };

  const handleReject = async () => {

    try {
      console.log("Inide the Try Block in Reject")
      const response = await axiosPrivate.put(
        `/application?applicationid=${application.applicationid}&status=Rejected`
      )
    } catch (err) {
      console.error('Failed to reject application:', err)
    }
    closeModal();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm py-20 ">
      <div
        id="scrollview"
        className="bg-white rounded drop-shadow-lg w-full h-fit mt-10 mx-10 border">


        <div className="flex flex-row justify-between">
          <h2 className="m-4 text-2xl font-semibold text-gray-800">Personal Details of Applicant:</h2>
          {/* close button */}
          <div className='flex flex-row justify-end my-auto mx-5'>
            <RiCloseLargeFill
              onClick={() => closeModal()}
              className='bg-red-500 rounded-full text-4xl p-2 text-white drop-shadow hover:bg-red-700' />
          </div>
        </div>


        <div id="report" className="w-full bg-gray-100 h-[55vh] overflow-y-auto p-6">

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="font-medium text-gray-700">First Name:</p>
              <p className="text-gray-600">{application.firstname}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="font-medium text-gray-700">Last Name:</p>
              <p className="text-gray-600">{application.lastname}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="font-medium text-gray-700">Email Address:</p>
              <p className="text-gray-600">{application.emailaddress}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="font-medium text-gray-700">Date of Birth:</p>
              <p className="text-gray-600">{application.dob}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="font-medium text-gray-700">Gender:</p>
              <p className="text-gray-600">{application.gender}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="font-medium text-gray-700">NIC:</p>
              <p className="text-gray-600">{application.nic}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="font-medium text-gray-700">Occupation:</p>
              <p className="text-gray-600">{application.occupation}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="font-medium text-gray-700">Nationality:</p>
              <p className="text-gray-600">{application.nationality}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="font-medium text-gray-700">Religion:</p>
              <p className="text-gray-600">{application.religion}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="font-medium text-gray-700">Number of Family Members:</p>
              <p className="text-gray-600">{application.nooffamilymembers}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="font-medium text-gray-700">Monthly Income:</p>
              <p className="text-gray-600">
                {application.monthlyincome !== null && application.monthlyincome !== undefined
                  ? application.monthlyincome.toFixed(2)
                  : "N/A"}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="font-medium text-gray-700">Home Address:</p>
              <p className="text-gray-600">{application.homeaddress}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="font-medium text-gray-700">City:</p>
              <p className="text-gray-600">{application.city}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="font-medium text-gray-700">Province:</p>
              <p className="text-gray-600">{application.province}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="font-medium text-gray-700">Postal Code:</p>
              <p className="text-gray-600">{application.postalcode}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="font-medium text-gray-700">Telephone Number:</p>
              <p className="text-gray-600">{application.telphonenum}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="font-medium text-gray-700">Cellphone Number:</p>
              <p className="text-gray-600">{application.cellphonenum}</p>
            </div>
          </div>

          <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-800">Preference Details:</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="font-medium text-gray-700">Gender of Child:</p>
              <p className="text-gray-600">{application.genderofchild}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="font-medium text-gray-700">Age Range:</p>
              <p className="text-gray-600">{application.agerange.join("-")}</p>
            </div>

          </div>
          <div className="p-4 my-4 bg-white rounded-lg shadow-sm">
            <p className="font-medium text-gray-700">Reason for Fostering:</p>
            <p className="text-gray-600">{application.reasonforfostering}</p>
          </div>
          <div className="p-4 my-4 bg-white rounded-lg shadow-sm">
            <p className="font-medium text-gray-700">Specific Needs:</p>
            <p className="text-gray-600">{application.specificneeds}</p>
          </div>
          <div className="p-4 my-4 bg-white rounded-lg shadow-sm">
            <p className="font-medium text-gray-700">Additional Comments:</p>
            <p className="text-gray-600">{application.additionalcomments}</p>
          </div>
        </div>

        <div className="flex justify-end p-4 my-auto">
          <PrimaryButton onClick={handleAccept} text='Accept' color="green" className={'mx-2'} disabled={application.status != 'Pending'} />
          <PrimaryButton onClick={handleReject} text='Reject' color="red" className={'mx-2'} disabled={application.status != 'Pending'} />
        </div>

      </div>
    </div>
  );
};

export default ApplicationModalAdmin;
