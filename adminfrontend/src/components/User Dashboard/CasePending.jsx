import React from 'react'
import sw from '../../assets/images/sw.webp'
import ProgressBar from './ProgressBar'

const CasePending = () => {
    return (
        <div>
            <div className="flex flex-col items-center w-3/5 text-center mx-auto">
                <ProgressBar step={4} />
                <h1 className='font-bold text-5xl mt-10'>Awaiting Social Worker Assignment
                </h1>
                <p className='mt-5'>
                    A social worker will be assigned to your case shortly. They will contact you to schedule home visits, interviews, and any necessary follow-ups.
                </p>
                <img src={sw} className='w-full  md:w-1/3 rounded-full m-10'></img>
            </div>
        </div>
    )
}

export default CasePending