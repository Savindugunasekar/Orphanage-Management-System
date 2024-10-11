import React from 'react'

const ProgressBar = ({ step }) => {
    return (
        <div className="flex flex-col items-center text-center w-full">
            <h1 className='m-5 text-3xl font-bold'>Adoption Process Progress</h1>
            <ul className="steps w-full mb-5">
                <li className={`step ${step >= 1 && "step-primary  "}`}> Fill the Form</li>
                <li className={`step ${step >= 2 && "step-primary"}`}> Get Approved</li>
                <li className={`step ${step >= 3 && "step-primary"}`}> Choose a Child</li>
                <li className={`step ${step >= 4 && "step-primary"}`}> Social Worker Assignment</li>
                <li className={`step ${step >= 5 && "step-primary"}`}> Phase 1</li>
                <li className={`step ${step >= 6 && "step-primary"}`}> Phase 2</li>
                <li className={`step ${step >= 7 && "step-primary"}`}> Phase 3</li>
                <li className={`step ${step >= 8 && "step-primary"}`}> Completed</li>
            </ul>
        </div>
    )
}

export default ProgressBar