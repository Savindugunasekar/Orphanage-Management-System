import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Phase1 from "./Phase1";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

const Case = () => {
  const { caseId } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const [caseDetails, setCaseDetails] = useState(null);
  const [isPhase1Open, setIsPhase1Open] = useState(false);

  useEffect(() => {
    const getCase = async () => {
      try {
        const response = await axiosPrivate.get(`/case/byId?caseid=${caseId}`);
        setCaseDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch case:", error);
      }
    };

    getCase();
  }, [caseId, axiosPrivate]);

  const togglePhase1 = () => {
    setIsPhase1Open((prevState) => !prevState);
  };

  if (!caseDetails) return <div>Loading...</div>;

  return (
    <div>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            CaseID: <span className="text-primary">{caseDetails.caseid}</span>
          </h1>
          <p className="text-lg text-gray-700 mb-2">
            <span className="font-semibold">Child's Name:</span>{" "}
            {caseDetails.child.name}
          </p>
          <p className="text-lg text-gray-700 mb-2">
            <span className="font-semibold">Parent's Name:</span>{" "}
            {caseDetails.parent.username}
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Assigned Social Worker:</span>{" "}
            {caseDetails.socialworker.username}
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg">
          <button
            className="flex justify-between items-center w-full p-10 text-primary text-2xl font-bold bg-white rounded-t-lg focus:outline-none"
            onClick={togglePhase1}
          >

            
            <span className="flex items-center">
              Phase 1 : Examine Documents

              {caseDetails.phase1 === 'Completed' && <span className="ml-2 px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-full">
                Approved
              </span>}
              
            </span>

            <FontAwesomeIcon
              icon={isPhase1Open ? faChevronUp : faChevronDown}
            />
          </button>
          {isPhase1Open && (
            <div className="p-4 bg-white">
              <Phase1 caseId={caseId} caseDetails={caseDetails} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Case;
