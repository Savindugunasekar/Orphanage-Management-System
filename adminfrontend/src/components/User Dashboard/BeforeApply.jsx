import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Carousel from "../Carousel";
import { slideImages } from "../../constants";
import Application from './Application';

const BeforeApply = () => {

    const steps = [
        {
            title: "Click the Apply Now button and fill out the form",
            description: "Start by clicking the 'Apply Now' button. Complete the application form with your details to initiate the fostering process.",
        },
        {
            title: "Wait for approval",
            description: "Once you've submitted your application, our team will review your information. This may take a few days. You'll be notified once your application is approved.",
        },
        {
            title: "Select a child",
            description: "After approval, you'll be able to browse through the profiles of available children. Choose a child that you feel connected to.",
        },
        {
            title: "Have a meeting with the social worker and the child",
            description: "Schedule a physical meeting with the assigned social worker and the child. This meeting is crucial for building a connection and ensuring compatibility.",
        },
        {
            title: "Proceed with further requirements",
            description: "Complete any remaining formalities, such as home visits, background checks, and legal documentation, to move forward in the adoption process.",
        },
    ];

    const [applicationVis, setApplicationVis] = useState(false)



    return (
        <div>
            <div className="flex flex-col items-center w-3/5 text-center mx-auto">
                <h1 className='font-bold text-5xl mt-10'>
                    <p className='text-orange-500'>Adopt a Child</p>
                    Welcome to a New Beginning
                </h1>
                <p className='mt-5'>
                    Your journey toward creating a family starts here.
                    We believe every child deserves a loving and supportive home.
                    Thank you for considering adoption and for choosing to provide
                    a child with a safe, nurturing environment. Your decision to adopt
                    can make a lasting difference in a child’s life.
                </p>
                <Link to="/user/application"><button
                    onClick={() => setApplicationVis(true)}
                    className="my-10 items-center justify-center w-72 text-primary border-2 border-primary px-4 py-3 text-xl flex gap-3 hover:gap-5  hover:text-white hover:bg-primary transition-all duration-300 group text-center">
                    Apply Now
                </button></Link>
                <Carousel images={slideImages} />
            </div>

            <div className="divider font-semibold">Adoption steps</div>

            <div className="flex flex-col items-center w-3/5 mx-auto my-10">
                <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
                    {steps.map((step, index) => (
                        <li key={index}>
                            <div className="timeline-middle">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="h-5 w-5">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                        clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className={`${index % 2 ? "timeline-end mb-10" : "timeline-start mb-10 md:text-end"}`}>

                                <time >Step {index + 1}</time>
                                <div className="text-lg font-bold text-orange-500">{step.title}</div>
                                {step.description}
                            </div>
                            <hr />
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    )
}

export default BeforeApply