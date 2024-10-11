import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Phase1 from "./User Dashboard/Phase1";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Loading from "./Loading";
import Lobby from "./Lobby";
import HomeVisit from "./HomeVisit";

const Case = () => {
  const { caseId } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const [caseDetails, setCaseDetails] = useState(null);

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

  if (!caseDetails) return <Loading />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Case Details Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6 mt-20">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          CaseID: <span className="text-primary">{caseDetails.caseid}</span>
        </h1>
        <p className="text-lg text-gray-700 mb-2">
          <span className="font-semibold">Child's Name:</span> {caseDetails.child.name}
        </p>
        <p className="text-lg text-gray-700 mb-2">
          <span className="font-semibold">Parent's Name:</span> {caseDetails.parent.username}
        </p>
        <p className="text-lg text-gray-700">
          <span className="font-semibold">Assigned Social Worker:</span> {caseDetails.socialworker.username}
        </p>
      </div>

      {/* Phase 1: Document Examination */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Phase 1: Examine Documents
          </h2>
          {caseDetails.phase1 === 'Completed' && (
            <span className="ml-2 px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-full">
              Approved
            </span>
          )}
        </div>
        <div className="px-4 py-5 bg-gray-100 rounded-lg">
          <Phase1 caseId={caseId} caseDetails={caseDetails} />
        </div>
      </div>

      {/* Video Conference Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Video Conference</h2>
        <div className="px-4 py-5 bg-gray-100 rounded-lg">
          <Lobby caseId={caseId} />
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Home Environment Assessment</h2>
        <div className="px-4 py-5 bg-gray-100 rounded-lg">
          <HomeVisit caseId={caseId} />
        </div>
      </div>
    </div>
  );
};

export default Case;
