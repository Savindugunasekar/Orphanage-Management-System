import React from 'react'
import Navbar from './Navbar'
import { Link } from 'react-router-dom'
import { orphanageList } from '../constants'
// import { Link } from 'react-scroll'
import Carousel from "./Carousel";
import { slideImages } from "../constants";


const UserDash = () => {  
    const buttonClasses = 'focus:outline-none text-black bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:ring-orange-300 rounded-lg text-2xl px-5 py-2.5 me-2 mb-2 dark:focus:ring-orange-800';
    const Orphanages = orphanageList.map(orphanage =>  orphanage.name + ' - ' + orphanage.district)
    return(
      <div>
        <Navbar />
       <div className='flex flex-col justify-center w-full h-screen items-left'>
          <img src="https://www.africacalling.org/wp-content/uploads/ghana-orphanage-volunteer-sarah-vigs-ghana-africa-sarah-from-uk.jpg" alt="Background Image" className="absolute inset-0 object-cover w-full h-full opacity-70" />
          <div className="relative z-10 px-4 mb-32 text-6xl text-black opacity-100 font-poppins ">
            LET’S BRIGHTEN THEIR LIVES
            <div className='mb-6 text-lg'>
              They will make the world in a different way
            </div>
            <Link to="/donateNow" className={`p-2 ${buttonClasses} z-10 inline-block`}>Donate Now</Link>
          </div>
        </div>
        <div className='w-full'>
        <div className='justify-center text-[#ff5722] font-poppins text-7xl '>
            <div className="flex justify-center">
                  Orphanages
            </div>
                             <div className="flex justify-center">
                                 <select className="p-4 mt-8 text-2xl border-2 border-black rounded-lg focus:outline-none text-[#ff5722] mb-16">
                                     <option value="Select Distric">Select Orphanage from Your Area ....</option>
                                   {Orphanages.map((district, index) => (
                                         <option key={index} value={district}>{district}</option>
                                     ))}
                         </select>
                  </div>
                  
          </div>
          <div className='carousel'>
              <Carousel images={slideImages}/>
          </div>
        </div>
        <div>
        </div>
        <div className='relative flex items-center justify-center w-full h-screen'>
                <img src="https://images.unsplash.com/photo-1577896852618-01da1dd79f7e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D.jpg" alt="Vision Background Image" className="absolute inset-0 object-cover w-full h-full opacity-70" />
                <div className='relative z-20 text-[#ff5722] font-poppins text-9xl text-left p-6'>
                    <span style={{ color: '#ff5722', textDecoration: 'underline', textDecorationColor: 'black', textUnderlineOffset: '10px'}}>Our Vision</span>
                </div>
                <div className="relative z-20 px-6 mt-6 text-2xl text-right text-black">
                    <b>Create awareness of the right of a child to be protected from abuse and the methods of preventing child abuse. Consult the relevant ministries, Provincial Councils, local authorities, District and Divisional Secretaries, public and private sector organizations, and recommend all necessary measures for preventing child abuse and for protecting and safeguarding the interests of the victims of such abuse.</b>
                </div>
            </div>

        <div className='w-full h-screen'>
            <div className='text-[#ff5722] font-poppins text-3xl text-center pt-10'>
                    <span style={{ textDecoration: 'underline', textDecorationColor: 'black',textUnderlineOffset: '5px' }}>What is Foostering</span>
                      <div className='mt-6 text-2xl'>
                            Fostering is the temporary care of children by families who provide a nurturing environment until the children can be reunited with their birth families or adopted. Our mission is to reintegrate children into environments where they can grow up with the love and care of a family. We strongly advocate for fostering, particularly for babies and children with special needs, as a crucial part of this mission. Every child deserves a loving family, and through fostering, we can provide them with the better future they deserve.
                    </div>
                    <div className='m-10'>
                               <Link to="/fosteringmain" className={`p-2 ${buttonClasses} z-0`}>Fostering</Link>
                           </div>
                       </div>
        </div>  
        <div className='relative w-full h-screen'>
        <img src="https://www.africacalling.org/wp-content/uploads/ghana-orphanage-volunteer-sarah-vigs-ghana-africa-sarah-from-uk.jpg" alt="Background Image" className="absolute inset-x-0 top-0 z-0 object-cover w-full h-2/3 opacity-70" />

         <div className="absolute inset-0 z-10 flex items-center justify-center w-full mt-32 h-2/3">
             <Link to="/donateNow" className={`px-56  ${buttonClasses} z-0`}><div className='text-4xl'>Donate Now</div></Link> 
         </div>
        
         <div className="absolute inset-x-0 bottom-0 w-full h-2/5 bg-[#ff8a65] flex items-center justify-between px-4">
             <div className='flex'>
                 <div className='flex flex-col items-start pl-6'>
                     <div className='pt-2 mt-10'>
                         Sri Lanka Child Protection Authority
                     </div>
                     <a href="./">
                         <img src="https://i.imgur.com/VXw99Rp.jpg" alt="logo" className='object-contain mt-6 w-96 h-36' />
                     </a>
                     <div className='mb-10'>
                         Copyright © 2024 SLCPA. All rights reserved.
                     </div>
                 </div>
                 <div className='pl-6 mt-2 pr-80'>
                     <div className='mt-10'>
                         The Sri Lanka Child Protection Authority (SLCPA) is dedicated  lo
                     </div>
                 </div>
             </div>
            
             <div className='pr-6 mb-6'>
                 <div className='mb-4' >
                     <strong>Contact Information:</strong>
                 </div>
                 <div>Email: info@slcpa.lk</div>
                 <div>Address: 123 Main St, Colombo, Sri Lanka</div>
             </div>
         </div>
     </div>
             </div>
      

    )
}
export default UserDash