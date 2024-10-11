import React from 'react'
import ProgressBar from './ProgressBar'
import { GiEmptyHourglass } from "react-icons/gi";

const FormPending = () => {
    return (
        <div>
            <div className="flex flex-col items-center w-3/5 text-center mx-auto">
                <ProgressBar step={2} />
                <h1 className='font-bold text-5xl mt-10'>Pending Approval
                </h1>
                <p className='mt-5'>
                    Thank you for submitting your adoption application.
                    Your application is currently under review by our team.
                    This step is crucial in ensuring that we find the best match for
                    the child and provide them with a loving and secure home.<br /><br />
                </p>
                <p>Once the review is complete, you will receive an email notification with the outcome of your application.</p>
                <GiEmptyHourglass className='text-9xl m-20' />
            </div>
        </div>
    )
}

export default FormPending