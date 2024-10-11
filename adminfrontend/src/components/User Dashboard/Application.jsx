import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FosteringApplication from './FosteringApplication'
import FosteringApplication2 from './FosteringApplication2'
import FosteringApplication3 from './FosteringApplication3'

const Application = () => {
    const [step1, setStep1] = useState(true)
    const [step2, setStep2] = useState(false)
    const [step3, setStep3] = useState(false)
    const [fosteringDetails, setFosteringDetails] = useState({ ageRange: [0, 18] });

    return (

        <div className={`m-2 mt-20`}>

            <Link to="/user/dashboard" className="link link-hover text-xl text-blue-600 my-5">Back to Home</Link>

            <h1 className="font-bold text-3xl text-center mb-2">Fostering Application</h1>

            <div className="flex flex-col items-center text-center w-full my-5">
                <ul className="steps">
                    <li className="step step-primary "></li>
                    <li className={`step ${step2 && "step-primary"} ${step3 && "step-primary"}`}></li>
                    <li className={`step ${step3 && "step-primary"}`}></li>
                </ul>
            </div>
            <div className='md:w-4/5 mx-auto'>
                {step1 && <FosteringApplication setStep1={setStep1} setStep2={setStep2} fosteringDetails={fosteringDetails} setFosteringDetails={setFosteringDetails} />}
                {step2 && <FosteringApplication2 setStep1={setStep1} setStep2={setStep2} setStep3={setStep3} fosteringDetails={fosteringDetails} setFosteringDetails={setFosteringDetails} />}
                {step3 && <FosteringApplication3 setStep2={setStep2} setStep3={setStep3} fosteringDetails={fosteringDetails} setFosteringDetails={setFosteringDetails} />}
            </div>
        </div>
    )
}

export default Application