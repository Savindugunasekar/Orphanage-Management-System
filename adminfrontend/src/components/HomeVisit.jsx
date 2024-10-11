import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const ROLES = {
  User: 1010,
  Head: 1910,
  SocialWorker: 2525,
  Admin: 7788,
};

const HomeVisit = ({ caseId }) => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [dates, setDates] = useState([{ dateTime: "", accepted: false }]);
  const [visits, setVisits] = useState([]);
  const [selectedVisitId, setSelectedVisitId] = useState(null);
  const [scheduledVisit, setScheduledVisit] = useState(null); 

  const addDate = () => {
    setDates([...dates, { dateTime: "", accepted: false }]);
  };

  const removeDate = (index) => {
    const updatedDates = dates.filter((_, i) => i !== index);
    setDates(updatedDates);
  };

  const handleDateChange = (index, value) => {
    const updatedDates = dates.map((date, i) =>
      i === index ? { ...date, dateTime: value } : date
    );
    setDates(updatedDates);
  };

  const getVisits = async () => {
    try {
      const response = await axiosPrivate.get(`/case/visits?caseid=${caseId}`);
      setVisits(response.data.visits);
    } catch (error) {
      console.error("Error fetching meetings", error);
    }
  };

  useEffect(() => {
    getVisits();
    getApproval();
  }, [caseId]);

  const setVisit = async () => {
    try {
      const response = await axiosPrivate.post("/case/visits", {
        caseId,
        visits: dates,
      });
      console.log("Visits set successfully", response.data);
      alert("Visits scheduled successfully!");
      getVisits();
    } catch (error) {
      console.error("Error setting the visits", error);
      alert("Failed to schedule visits.");
    }
  };

  const scheduleVisit = async () => {
    const visitToAccept = visits.find((visit) => visit.id === selectedVisitId);
    if (!visitToAccept) return;

    try {
      const updatedVisit = { ...visitToAccept, accepted: true };
      await axiosPrivate.put(`/case/visits?caseid=${caseId}`, { updatedVisit });

      setScheduledVisit(updatedVisit); 
      setSelectedVisitId(null); 
      getVisits(); 
    } catch (error) {
      console.error("Error accepting visit", error);
      alert("Failed to accept visit.");
    }
  };

  
  const acceptedVisit = visits.find((visit) => visit.accepted === true);

  const [homeCondition, setHomeCondition] = useState({
    hasEnoughSpace: false,
    isClean: false,
    isSafe: false,
    hasStableIncome: false,
    approved: false,
    remarks: "",
  });

  const handleHomeConditionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHomeCondition({
      ...homeCondition,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const submitHomeConditionApproval = async () => {
    try {
      await axiosPrivate.post(
        `/case/approval?caseId=${caseId}`,
        {homeCondition}
      );
      alert("Home condition form submitted successfully!");
    } catch (error) {
      console.error("Error submitting home condition", error);
      alert("Failed to submit home condition form.");
    }
  };

  const getApproval = async () => {
    try {
      const response = await axiosPrivate.get(`/case/approval?caseid=${caseId}`);
      setHomeCondition(response.data.approval || null); 
      
    } catch (error) {
      console.error("Error fetching approval", error);
      
    }
  };

  useEffect(() => {
    getApproval();
  }, [caseId]);

  return (
    <div className="bg-white min-h-screen p-6">
      <div>
        {(auth.roles.includes(ROLES.Head) ||
          auth.roles.includes(ROLES.SocialWorker)) && (
          <div className="bg-white shadow-lg p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Schedule Home Visits</h2>

            {dates.map((date, index) => (
              <div key={index} className="mb-4">
                <label
                  htmlFor={`datetime-${index}`}
                  className="block text-gray-700"
                >
                  Date and Time {index + 1}
                </label>
                <input
                  id={`datetime-${index}`}
                  type="datetime-local"
                  value={date.dateTime}
                  onChange={(e) => handleDateChange(index, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={() => removeDate(index)}
                  className="text-red-500 text-sm mt-2"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              onClick={addDate}
              className="bg-gray-200 text-black py-2 px-4 rounded-md mb-4 mr-5"
            >
              Add another date
            </button>

            <button
              onClick={setVisit}
              className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition"
            >
              Set up visits
            </button>
          </div>
        )}
      </div>

      <div id="list of visits" className="mt-6">
  <div>
    {acceptedVisit ? (
      <div className="bg-primary text-white p-4 rounded-lg">
        <p className="font-bold">You have a home visit scheduled on:</p>
        <p className="text-lg">
          {new Date(acceptedVisit.dateTime).toLocaleString()}
        </p>
      </div>
    ) : (
      // Use parentheses here instead of curly braces for the conditional rendering
      auth.roles == 1010 && homeCondition === null && (
        <div>
          <h2 className="text-xl font-bold mb-4">Proposed Home Visits</h2>
          {visits.length > 0 ? (
            <div className="space-y-4">
              {visits.map((visit, index) => (
                <div
                  key={index}
                  className={`flex items-center p-4 border rounded-lg shadow-sm ${
                    selectedVisitId === visit.id ? "bg-blue-50" : "bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    id={`visit-${index}`}
                    name="visitSelection"
                    value={visit.id}
                    checked={selectedVisitId === visit.id}
                    onChange={() => setSelectedVisitId(visit.id)}
                    className="mr-3"
                  />
                  <div className="flex-grow">
                    <p className="text-gray-700">
                      Date and Time: {visit.dateTime}
                    </p>
                    <p className="text-gray-700">
                      Accepted: {visit.accepted ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              ))}
              <button
                onClick={scheduleVisit}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
              >
                Schedule Visit
              </button>
            </div>
          ) : (
            <p>No visits scheduled.</p>
          )}
        </div>
      )
    )}
  </div>
</div>


      {(auth.roles.includes(ROLES.Head) ||
          auth.roles.includes(ROLES.SocialWorker)) && <div>
             <div className="bg-white min-h-screen p-6">
     
        <div className="bg-white p-8  rounded-lg space-y-6 mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Home Condition Approval Form
          </h2>
          {/* Form input fields */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="hasEnoughSpace"
              checked={homeCondition?.hasEnoughSpace || false}
              onChange={handleHomeConditionChange}
              className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label className="ml-3 text-gray-700 font-medium">
              Has enough space for the child
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isClean"
              checked={homeCondition?.isClean || false}
              onChange={handleHomeConditionChange}
              className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label className="ml-3 text-gray-700 font-medium">
              The home is clean and suitable
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isSafe"
              checked={homeCondition?.isSafe || false}
              onChange={handleHomeConditionChange}
              className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label className="ml-3 text-gray-700 font-medium">
              The home is safe for a child
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="hasStableIncome"
              checked={homeCondition?.hasStableIncome || false}
              onChange={handleHomeConditionChange}
              className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label className="ml-3 text-gray-700 font-medium">
              The family has a stable income
            </label>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-2">
              Remarks
            </label>
            <textarea
              name="remarks"
              value={homeCondition?.remarks || ""}
              onChange={handleHomeConditionChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Add any remarks here"
              rows={4}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="approved"
              checked={homeCondition?.approved || false}
              onChange={handleHomeConditionChange}
              className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label className="ml-3 text-gray-700 font-medium">
              Approve Home Condition
            </label>
          </div>

          <button
            type="button"
            onClick={submitHomeConditionApproval}
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition"
          >
            Submit Approval
          </button>
        </div>
      
    </div></div>}
      
     
      </div>
    
  );
};

export default HomeVisit;
