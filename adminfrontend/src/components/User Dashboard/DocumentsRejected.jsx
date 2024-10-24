import React, { useState } from 'react'
import BeforeApply from './BeforeApply';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const DocumentsRejected = ({caseDetails}) => {

    const axiosPrivate =useAxiosPrivate();

    const [showBeforeApply, setShowBeforeApply] = useState(false);
    const handleApplyAgain = async () => {
        try {
          const response = await axiosPrivate.post('/case/delete', {caseDetails}, {
            headers: {
              "Content-Type": "application/json"
            }
          });
      
          // Check if the request was successful
          if (response.status === 200) {
            console.log('Case deleted successfully');
            setShowBeforeApply(true); // Show the BeforeApply component
          } else {
            console.log('Failed to delete case');
          }
      
        } catch (error) {
          console.error('Error deleting case:', error);
        }
      };
      




    return (
        <div>{
            !showBeforeApply ? (

                
                <div id="reject-content" className="flex flex-col items-center w-3/5 text-center mx-auto">
                <h1 className='font-bold text-5xl my-10'>
                    Documents  <span className='text-red-500 inline'>Rejected</span>
                </h1>

                <p>We regret to inform you that after careful review, your adoption application has not been approved at this time.
                    We understand this may be disappointing, but our priority is to ensure the best possible care and placement for the children.</p>
                <h2 className='font-bold text-4xl my-10'>
                    Why Was My Documents Rejected?
                </h2>
                <p className='font-semibold'>There could be various reasons for the rejection, such as:</p>
                <p className=''>
                    * Incomplete or inaccurate information provided<br></br>
                    * Specific requirements not being met<br></br>
                    * Issues identified during the initial review process<br></br>
                    Please note that this decision was made in the best interest of the child, based on our thorough assessment of your application.
                </p>
                <h1 className='font-bold text-4xl my-10'>Whats next?</h1>
                <p >If you have any questions or would like to discuss this decision further, please contact our team. We are more than willing to provide feedback or offer guidance on what steps you can take to improve your application in the future.

                    Thank you for your understanding and for considering adoption. We appreciate your desire to provide a loving home for a child, and we encourage you to stay engaged with our adoption program.</p>

                    <button
                        className="mt-10 py-2 px-6 bg-primary text-white font-bold  rounded-lg "
                        onClick={handleApplyAgain}
                    >
                        Apply again
                    </button>



            </div>

           
                   
            ) : (
                <BeforeApply />
            )

        }




        </div>
    )
}

export default DocumentsRejected
