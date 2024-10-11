import React from "react";
import Navbar from "./Navbar";
import Carousel from "./Carousel";
import ChatBot from "./ChatBot";
import { slideImages } from "../constants";
import { Link } from "react-router-dom";

const buttonClasses = 'focus:outline-none text-black bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:ring-orange-300 rounded-lg text-2xl px-5 py-2.5 me-2 mb-2';

const steps = [
  {
    title: "Step 1: Is adoption suitable for you?",
    description: "Why do you want to adopt? Can you prioritize your child’s needs? Fill the fostering application and answer all the questions...",
  },
  {
    title: "Step 2: Check your Notification Box. If accepted, continue...",
    description: "Are you eligible to adopt? If you are OK with the proceedings, submit necessary documents for the next steps.",
  },
  {
    title: "Step 3: Check Your Notification Box again. If accepted, choose suitable children for you and submit the documents.",
    description: "Check a convenient time to have a virtual meeting with the social worker for the proceedings.",
  },
  {
    title: "Step 4: Have a physical meeting with the social worker and the child.",
    description: "If OK, arrange a physical meeting with the social worker and the children at the orphanage.",
  },
  {
    title: "OK, proceed with the next steps and schedule regular meetings every two weeks.",
    description: "",
  },
];

export default function FosteringMain() {
  return (
    <div>
      <Navbar />
      <aside id="cta-button-sidebar" className="fixed left-0 z-40 h-screen transition-transform -translate-x-full top-20 w-80 sm:translate-x-0" aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50">
          <ul className="space-y-2 font-medium">
            <li><a href="/fostering" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">Fostering Application</a></li>
            <li><a href="/myapplications" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">Pending Applications</a></li>
            <li><a href="/mycases" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">My Cases</a></li>
            <li><a href="/newnav" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">new nav</a></li>
          </ul>
        </div>
      </aside>

      <div className="flex h-screen">

        <div className="pt-32 pl-96 w-3/4 pr-16">
          <h2 className="font-heading mb-8 text-3xl font-bold lg:text-4xl">Steps to Foster a Child</h2>

          {steps.map((step, index) => (
            <div className="flex" key={index}>
              <div className="flex flex-col items-center mr-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${index === steps.length - 1 ? 'border-primary bg-primary' : 'border-primary'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-6 w-6 ${index === steps.length - 1 ? 'text-white' : 'text-primary'}`}>
                    {index === steps.length - 1 ? (
                      <path d="M5 12l5 5l10 -10"></path>
                    ) : (
                      <>
                        <path d="M12 5l0 14"></path>
                        <path d="M18 13l-6 6"></path>
                        <path d="M6 13l6 6"></path>
                      </>
                    )}
                  </svg>
                </div>
                {index < steps.length - 1 && <div className="w-px h-full bg-gray-300"></div>}
              </div>
              <div className="pt-1 pb-8">
                <p className="mb-2 text-xl font-bold text-gray-900">{step.title}</p>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="w-1/2">
          <Carousel images={slideImages} />
        </div> */}

      </div>



      <div className="mt-8">
        <ChatBot />
      </div>
    </div>
  );
}
