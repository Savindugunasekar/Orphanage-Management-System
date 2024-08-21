import React from 'react'
import { Link } from 'react-router-dom'  
import UserApplicationList from './UserApplicationList';

const buttonClasses = 'focus:outline-none text-black bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:ring-orange-300 rounded-lg text-2xl px-5 py-2.5 me-2 mb-2 dark:focus:ring-orange-800';

export default function FosteringMain() {
  return (
    <div>
    <div className='flex justify-center m-10'>
        <Link to="/fostering" className={`p-2 ${buttonClasses} z-0`}>Fostering Application</Link>
    </div>
    <div className="flex justify-center">
        <Link to="/myapplications" className={`p-2 ${buttonClasses} z-0`}>Applications</Link>
    </div>

    <div className="flex justify-center">
        <Link to="/mycases" className={`p-2 ${buttonClasses} z-0`}>Ongoing Cases</Link>
    </div>




    
    </div>
  )
}
