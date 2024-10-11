import React from 'react'

const FormRejected = () => {
    return (
        <div>
            <div className="flex flex-col items-center w-3/5 text-center mx-auto">
                <h1 className='font-bold text-5xl my-10'>
                    Application <span className='text-red-500 inline'>Rejected</span>
                </h1>

                <p>We regret to inform you that after careful review, your adoption application has not been approved at this time.
                    We understand this may be disappointing, but our priority is to ensure the best possible care and placement for the children.</p>
                <h2 className='font-bold text-4xl my-10'>
                    Why Was My Application Rejected?
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
            </div>

        </div>
    )
}

export default FormRejected