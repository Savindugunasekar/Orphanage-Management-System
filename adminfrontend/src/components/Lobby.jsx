import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';

const ROLES = {
  User: 1010,
  Head: 1910,
  SocialWorker: 2525,
  Admin: 7788,
};

const Lobby = ({caseId}) => {
  const {auth} =useAuth();
  const navigate = useNavigate();
  
  const linkRef = useRef();
  const [dateTime, setDateTime] = useState('');
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [report, setReport] = useState('');
  const [meetings, setMeetings] = useState([]);
  

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    if (caseId) {
      linkRef.current.value = caseId;
      getMeetings();
    }
  }, [caseId]);




  const handleFormSubmit = (e) => {
    e.preventDefault();
    const inviteCode = e.target.invite_link.value;
    navigate(`/chatroom/${inviteCode}`, { replace: true });
  };

  const completePhase2 = async () => {
    await axiosPrivate.put(`/case/phase2?caseid=${caseId}`);
    alert('Phase 2 completed successfully!');
    
  }


  const getMeetings = async () => {
    try {
      const response = await axiosPrivate.get(`/case/meetings?caseid=${caseId}`);
      setMeetings(response.data.meetings);
    } catch (error) {
      console.error('Error fetching meetings', error);
    }
  };

  const setMeeting = async () => {
    const meeting = { date: dateTime, report: null };



    try {




      const response = await axiosPrivate.post('/case/meetings', { caseId, meeting });
      console.log('Meeting set successfully', response.data);
      alert('Meeting scheduled successfully!');
      getMeetings(); // Refresh meetings after setting a new one
    } catch (error) {
      console.error('Error setting the meeting', error);
      alert('Failed to schedule meeting.');
    }
  };

  const handleMeetingClick = (meeting) => {
    setSelectedMeeting(meeting);
    setReport(meeting.report || '');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMeeting(null);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (selectedMeeting) {
      const updatedMeeting = { ...selectedMeeting, report };
      try {
        await axiosPrivate.put(`/case/meetings?caseid=${caseId}`, { meeting: updatedMeeting });
        setMeetings((prevMeetings) =>
          prevMeetings.map((m) => (m.date === selectedMeeting.date ? updatedMeeting : m))
        );
        alert('Report updated successfully!');
      } catch (error) {
        console.error('Error updating report', error);
        alert('Failed to update report.');
      } finally {
        closeModal();
      }
    }
  };

  return (
    <div className="bg-white min-h-screen p-6">
      <h1 className='text-primary font-bold text-3xl mb-6'>Video Conference</h1>
      <div className='flex gap-6'>
        <div className='w-3/4'>
        {(auth.roles.includes(ROLES.Head) || auth.roles.includes(ROLES.SocialWorker)) && (
           <div className='bg-white shadow-lg p-6 rounded-lg'>
           <h2 className='text-xl font-bold mb-4'>Set up a Meeting</h2>
           <div className='mb-4'>
             <label htmlFor="datetime" className='block text-gray-700'>Date and Time</label>
             <input
               id='datetime'
               type="datetime-local"
               value={dateTime}
               onChange={(e) => setDateTime(e.target.value)}
               className='w-full p-2 border border-gray-300 rounded-md'
             />
           </div>
           <button
             onClick={setMeeting}
             className='bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition'
           >
             Set up
           </button>
         </div>
        )}
         

          <div id='meetings' className='mt-6'>

          {(auth.roles.includes(ROLES.Head) || auth.roles.includes(ROLES.SocialWorker)) && (
            <div>
                 {meetings.slice().reverse().map((meeting, index) => (
                    <div
                      key={index}
                      onClick={() => handleMeetingClick(meeting)}
                      className="bg-white p-6 border border-gray-300 rounded-md shadow-sm mb-4 cursor-pointer"
                    >
                      <h3 className="text-lg font-bold mb-2">Meeting {meetings.length - index}</h3>
                      <p>Date: {new Date(meeting.date).toLocaleDateString()}</p>
                      <p>Time: {new Date(meeting.date).toLocaleTimeString()}</p>
                    </div>
                  ))}

<button
             onClick={completePhase2}
             className='bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition'
           >
             Conclude second phase
           </button>

                  
            </div>
            

            
               
          )
          
          }



{auth.roles == 1010 && (
  <div >

{meetings
  .filter(meeting => new Date(meeting.date) > new Date()) 
  .slice()
  .reverse()
  .map((meeting, index) => (
    <div
      key={index}
      
      className="bg-white p-6 border border-gray-300 rounded-md shadow-sm mb-4 cursor-pointer"
    >
      <h3 className="text-lg font-bold mb-2">Meeting {meetings.length - index}</h3>
      <p>Date: {new Date(meeting.date).toLocaleDateString()}</p>
      <p>Time: {new Date(meeting.date).toLocaleTimeString()}</p>
    </div>
  ))}


  </div>
)}





      
          </div>
        </div>

        <div className="w-1/4">
          <div className='bg-white shadow-lg p-6 rounded-lg'>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                name="invite_link"
                placeholder="Enter invite link"
                required
                ref={linkRef}
               
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />
              <input
                type="submit"
                value="Join Room"
                className={`w-full  bg-primary  cursor-pointer  text-white py-2 px-4 rounded-md hover:bg-primary  transition`}
                
              />


              
            </form>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">Meeting Details</h2>
            <p>Date: {new Date(selectedMeeting.date).toLocaleDateString()}</p>
            <p>Time: {new Date(selectedMeeting.date).toLocaleTimeString()}</p>
            {selectedMeeting.report ? (
              <div className='mb-4'>
                <p>Report: {selectedMeeting.report}</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit}>
                <textarea
                  value={report}
                  onChange={(e) => setReport(e.target.value)}
                  placeholder="Type your report here"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows="4"
                />
                <button type="submit" className="mt-4 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition">
                  Submit Report
                </button>
              </form>
            )}
            <button onClick={closeModal} className="mt-4 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lobby;
