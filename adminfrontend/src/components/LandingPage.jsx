import React, { useState } from 'react'
import Navbar from './Navbar'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import logo from '../assets/images/logo.png'

// import { Link } from 'react-scroll'
import Carousel from "./Carousel";
import { slideImages } from "../constants";
import { RiInboxArchiveFill } from "react-icons/ri";
import { FaSignOutAlt } from "react-icons/fa";
import UserFostering from './UserFostering';
import Fostering from "../assets/images/fostering.jpg";
import useLogout from '../hooks/useLogout';
import useAuth from '../hooks/useAuth';

const LandingPage = () => {

    const [visibility, setVisibility] = useState(0);
    const {auth} = useAuth();
    const logout = useLogout();

    const signout = async () => {
        await logout();
        
      };

    return (
        <div>
            {/*nav bar*/}
            <nav className='fixed z-40 w-full border-b-2 bg-white border-black-500 h-16'>
                <div className='flex items-center justify-between rounded h-full'>
                    <div className='flex items-center ml-6'>
                        <a href="./admin">
                            <img src={logo} alt="logo" className='w-12 h-12' />
                        </a>
                        <p className='text-xl text-primary font-bold'>OrphanCare</p>
                    </div>
                    <div className='flex flex-row'>
                        <p className={`ml-1 hover:text-orange-600 hover:text-xl font-bold ${visibility == 0 && 'text-xl text-orange-600 font-bold'}`} onClick={() => setVisibility(0)} > Home</p>
                        <p className='ml-1' > | </p>
                        <p className={`ml-1 hover:text-orange-600 hover:text-xl font-bold ${visibility == 1 && 'text-xl text-orange-600 font-bold '}`} onClick={() => setVisibility(1)} > Fostering</p>
                    </div>
                    <div className='p-4'>
                        <ul className='flex space-x-6'>
                            <li>{auth.userId == null ?<Link to={"/login"}>
                                    <button
                                        onClick={() => { }}
                                        className='flex items-center px-6 py-2 min-w-[120px] text-center text-orange-600 border border-orange-600 rounded hover:bg-orange-600 hover:text-white  focus:outline-none focus:ring'>
                                        <FaSignOutAlt />

                                        <p className='ml-1'> Login</p>
                                    </button>
                                </Link>:( <button className='p-2 font-semibold transition-colors duration-300 border-2 rounded-md text-primary border-primary hover:bg-primary hover:text-white' onClick={signout}>
                Sign Out
              </button>) }
                                
                            </li>

                        </ul>
                    </div>
                </div>
            </nav >

            {visibility == 0 &&
                <>
                    <div className="flex flex-col justify-center items-center w-full h-screen relative">
                        <img src="https://images.unsplash.com/photo-1617878227827-8360231f7f03?q=80&w=1912&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Background Image" className="absolute inset-0 object-cover w-full h-full opacity-70" />
                        <div className="relative z-10 text-8xl text-white font-extrabold text-center drop-shadow-lg">
                            LET’S <p className='text-orange-600'>BRIGHTEN </p>THEIR LIVES 
                          
                         

                        </div>
                        
                    </div>
                    <div className="h-screen w-full flex ">
        <div className="w-1/2 h-full flex items-center justify-center">
          <div className="bg-white border-2 border-primary rounded-xl justify-center flex items-center flex-col shadow-xl w-2/3 h-[80%]">
            <h1 className="relative my-10 text-2xl font-bold text-center">
              Our Vision
              <span className="block w-[100px] h-1 bg-primary mx-auto mt-3"></span>
            </h1>

            <div className="p-10 text-justify font-semibold">
              Our vision is to foster a world where every child in need has the
              opportunity to thrive. We are dedicated to supporting orphanages
              across the country through user contributions, ensuring that
              donations are used effectively to provide essential resources and
              create nurturing environments for children. Additionally, we aim
              to simplify the adoption process, helping families connect with
              children who need loving homes. By bridging the gap between
              generosity and action, we strive to make a meaningful impact,
              offering every child a chance for a brighter, more hopeful future.
            </div>
          </div>
        </div>
        <div className=" w-1/2 h-full justify-center items-center flex flex-col">
          <div className="h-[80%]  w-full px-10">
            <div className="font-bold text-3xl text-primary mb-10">
              Our Visionary Pillars Driving Success...
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col items-center">
                <div className="w-36 h-36  rounded-full overflow-hidden mb-4">
                  <img
                    src="https://www.themarque.com/photos-cache/profile-images/09301005-63975842820d24/profile_public_big.png"
                    alt="Pillar 1"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-lg font-semibold">Name 1</div>
                <div className="text-gray-700">Post 1</div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-36 h-36  rounded-full overflow-hidden mb-4">
                  <img
                    src="https://www.themarque.com/photos-cache/profile-images/09301005-63975842820d24/profile_public_big.png"
                    alt="Pillar 2"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-lg font-semibold">Name 2</div>
                <div className="text-gray-700">Post 2</div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-36 h-36 rounded-full overflow-hidden mb-4">
                  <img
                    src="https://www.themarque.com/photos-cache/profile-images/09301005-63975842820d24/profile_public_big.png"
                    alt="Pillar 3"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-lg font-semibold">Name 3</div>
                <div className="text-gray-700">Post 3</div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-36 h-36 rounded-full overflow-hidden mb-4">
                  <img
                    src="https://www.themarque.com/photos-cache/profile-images/09301005-63975842820d24/profile_public_big.png"
                    alt="Pillar 4"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-lg font-semibold">Name 4</div>
                <div className="text-gray-700">Post 4</div>
              </div>
            </div>
          </div>
        </div>
      </div>


                    <div className='w-full'>

                        <div className='carousel'>
                            <Carousel images={slideImages} />
                        </div>
                    </div>
                    <div className=" w-full h-screen flex">
        <div className="w-1/2 h-full">
          <img src={Fostering} alt="" className="object-cover w-full h-full " />
        </div>

        <div className="w-1/2  h-full p-20 justify-center items-center flex flex-col">
          <div className="text-3xl font-bold mb-20">
            Begin a beautiful new chapter..
          </div>
          <div className="max-w-[500px] font-semibold ">
            We will walk you through each step of the journey to welcoming a
            child into your heart and home. By following the detailed
            instructions and completing the necessary forms, you’ll be taking
            the first step toward joining our course and making a profound
            difference in a child's life.
            <Link to="/login">
              <div
                id="button"
                className="mt-10 text-primary border-2 border-primary px-4 py-3 text-xl flex gap-3 hover:gap-5 items-center max-w-[200px] hover:text-white hover:bg-primary transition-all duration-300 group"
              >
                <div>Apply here..</div>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="text-primary group-hover:text-white"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full h-screen  flex">
      <div className="w-1/2  h-full p-20 justify-center items-center flex flex-col">
          <div className="text-3xl font-bold mb-20">
       Extend a helping hand..
          </div>
          <div className="max-w-[500px] font-semibold ">
          our donation to the Child Protection Authority helps fund orphanages that provide essential support to children in need. Every contribution goes directly toward meeting the basic needs of these children, such as food, education, and healthcare. By donating, you are investing in the future of these young lives, ensuring they have the resources and opportunities to grow and thrive. Together, we can make a difference and offer these children a brighter and more hopeful future.
            <Link to="/donateNow">
              <div
                id="button"
                className="mt-10 text-primary border-2 border-primary px-4 py-3 text-xl flex gap-3 hover:gap-5 items-center max-w-[200px] hover:text-white hover:bg-primary transition-all duration-300 group"
              >
                <div>Donate here..</div>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="text-primary group-hover:text-white"
                />
              </div>
            </Link>
          </div>
        </div>
        <div className="w-1/2 h-full ">
        <img
        className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1577896852618-01da1dd79f7e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D.jpg"
          alt="Vision Background Image"
          
        /></div>
      </div>


                    {/* <div class="flex items-center h-[100vh] justify-center">
                        <card class="relative bg-[rgba(0,0,0,0.2)] h-full w-screen ">
                            <img src="https://images.unsplash.com/photo-1577896852618-01da1dd79f7e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D.jpg" class="object-cover w-full h-full rounded-lg" />
                            <div class="absolute w-full h-full bottom-0  rounded-lg flex flex-col items-center justify-center text-center">
                                <div className='relative z-20 text-white font-poppins text-9xl text-left p-6 mb-20'>
                                    <span className='border-white border'>Our Vision</span>
                                </div>

                                <p class="text-2xl px-14 text-gray-300 mt-10">
                                    Create awareness of the right of a child to be protected from abuse and the methods of
                                    preventing child abuse. Consult the relevant ministries, Provincial Councils, local authorities,
                                    District and Divisional Secretaries, public and private sector organizations, and recommend all
                                    necessary measures for preventing child abuse and for protecting and safeguarding the interests of
                                    the victims of such abuse.
                                </p>
                                <p class="text-base font-bold px-14 text-gray-300 mt-3">
                                    Child Protection authority
                                </p>
                            </div>
                        </card>
                    </div> */}
                </>
            }{visibility == 1 && <UserFostering />}


            
      <footer className="border-t shadow-xl bg-white py-10 px-20">
  <div className="flex justify-between items-start">
   
    <div className="flex items-center space-x-4">
      <img src={logo} alt="OrphanCare Logo" className="h-20 w-20" />
      <div>
        <h2 className="text-3xl font-bold text-primary">OrphanCare</h2>
        <p className="text-gray-400">Brightening lives, one child at a time.</p>
      </div>
    </div>

    
    <div className="flex space-x-16">
      <div>
        <h3 className="text-xl font-semibold text-primary mb-4">Quick Links</h3>
        <ul className="space-y-2">
          <li><Link to="/about" className="hover:underline text-gray-500">About Us</Link></li>
          <li><Link to="/fosteringmain" className="hover:underline text-gray-500">Fostering</Link></li>
          <li><Link to="/donateNow" className="hover:underline text-gray-500">Donate</Link></li>
          <li><Link to="/contact" className="hover:underline text-gray-500">Contact Us</Link></li>
        </ul>
      </div>

     
      <div>
        <h3 className="text-xl font-semibold text-primary mb-4">Contact Us</h3>
        <ul className="space-y-2">
          <li className="text-gray-500">Phone: +123 456 7890</li>
          <li className="text-gray-500">Email: info@orphancare.org</li>
          <li className="text-gray-500">Address: 123 Orphan Street, City, Country</li>
        </ul>
      </div>
    </div>
  </div>

  {/* Footer Bottom Section */}
  <div className="mt-10 border-t-2 border-primary pt-6 text-center text-gray-500">
    © 2024 OrphanCare. All rights reserved.
  </div>
</footer>



        </div >

        


    )
}

export default LandingPage