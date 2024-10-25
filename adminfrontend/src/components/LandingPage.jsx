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

import sahan from "../assets/images/sahan.png";
import savindu from '../assets/images/savindu.png'
import malindu from '../assets/images/malindu.png'

const LandingPage = () => {

  const [visibility, setVisibility] = useState(0);
  const { auth } = useAuth();
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
              <li>{auth.userId == null ? <Link to={"/login"}>
                <button
                  onClick={() => { }}
                  className='flex items-center px-6 py-2 min-w-[120px] text-center text-orange-600 border border-orange-600 rounded hover:bg-orange-600 hover:text-white  focus:outline-none focus:ring'>
                  <FaSignOutAlt />

                  <p className='ml-1'> Login</p>
                </button>
              </Link> : (<button className='p-2 font-semibold transition-colors duration-300 border-2 rounded-md text-primary border-primary hover:bg-primary hover:text-white' onClick={signout}>
                Sign Out
              </button>)}

              </li>

            </ul>
          </div>
        </div>
      </nav >

      {visibility == 0 &&
        <>
          <div className="flex flex-col justify-center items-center w-full h-screen relative">
            <img src="https://images.unsplash.com/photo-1617878227827-8360231f7f03?q=80&w=1912&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Background Image" className="absolute inset-0 object-cover w-full h-full opacity-70" />
            <div className="relative z-10 text-6xl lg:text-8xl text-white font-extrabold text-center drop-shadow-lg">
              LET’S <p className='text-orange-600'>BRIGHTEN </p>THEIR LIVES



            </div>

          </div>
          <div className=" w-full flex flex-col ">
            <div className=" h-full flex items-center justify-center">
              <div className="bg-white border-2 border-primary rounded-xl justify-center flex items-center flex-col shadow-xl w-full p-5 m-2">
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

            <div className=" h-full justify-center items-center flex flex-col m-5">
              <div className="h-[80%]  w-full px-10">
                <div className="font-bold text-3xl text-primary mb-10 text-center w-full">
                  Developers
                </div>

                <div className="grid grid-rows-1 md:grid-cols-3 gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-36 h-36  rounded-full overflow-hidden mb-4">
                      <img
                        src={sahan}
                        alt="Pillar 1"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-lg font-semibold">Sahan</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-36 h-36  rounded-full overflow-hidden mb-4">
                      <img
                        src={savindu}
                        alt="Pillar 2"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-lg font-semibold">Savindu</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-36 h-36 rounded-full overflow-hidden mb-4">
                      <img
                        src={malindu}
                        alt="Pillar 3"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-lg font-semibold">malindu</div>
                  </div>


                </div>
              </div>
            </div>
          </div>


          {/* <div className='w-full'>
            <div className='carousel'>
              <Carousel images={slideImages} />
            </div>
          </div> */}
          <div className="w-full flex flex-col  m-5 rounded-full">
            <div className="relative h-full">
              <img src={Fostering} alt="" className="object-cover w-full h-full" />
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                <div className="h-full p-5 md:p-10 lg:p-20 flex flex-col justify-center items-center">
                  <div className="text-xl md:text-4xl font-bold mb-5 md:mb-10 text-white text-center">
                    Begin a beautiful new chapter..
                  </div>
                  <div className="font-semibold text-white text-center text-lg md:text-2xl mb-5">
                    We will walk you through each step of the journey to welcoming a child
                    into your heart and home.
                  </div>
                  <Link to="/login">
                    <div
                      id="button"
                      className="mt-5 text-primary border-2 border-primary px-3 md:px-4 py-2 md:py-3 text-lg md:text-xl flex justify-center items-center gap-2 md:gap-3 max-w-[200px] hover:text-white hover:bg-primary transition-all duration-300 group"
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
          </div>


          <div className="w-full flex flex-col m-5">
            <div className="relative h-full">
              <img src='https://images.unsplash.com/photo-1577896852618-01da1dd79f7e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D.jpg' alt="" className="object-cover w-full h-full" />
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                <div className="h-full p-5 md:p-10 lg:p-20 flex flex-col justify-center items-center">
                  <div className="text-2xl md:text-4xl font-bold mb-5 md:mb-10 text-white text-center">
                    Extend a helping hand..
                  </div>
                  <div className="font-semibold text-white text-center text-lg md:text-2xl mb-5">
                    our donation to the Child Protection Authority helps fund orphanages that provide
                    essential support to children in need.
                  </div>
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
            </div>
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
        <div className="flex justify-between items-start flex-col md:flex-row">

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