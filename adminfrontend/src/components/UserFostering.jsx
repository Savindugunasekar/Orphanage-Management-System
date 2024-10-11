import React, { useState } from "react";
import { Link } from "react-router-dom";
import { orphanageList } from "../constants";

const UserFostering = () => {
  return (
    <div>
      <div className="relative w-full h-[100vh]">
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(255,87,34,0.6)] to-transparent]"></div>

        <img
          src="https://www.thefosteringnetwork.org.uk/sites/default/files/2020-01/home-top.jpg"
          alt="Fostering"
          className="w-full h-full object-cover"
        />

        <div className="absolute flex flex-col inset-0 px-10 top-[40%]">
          <div className="text-5xl  text-white mb-3 font-bold  ">
            A Journey of Care
          </div>
          <div className="text-7xl  text-white font-bold  ">
            What is Fostering?
          </div>
        </div>
      </div>

      <div
        id="fostering info"
        className="h-[60vh] w-full flex justify-center items-center "
      >
        <div className="w-[80%] h-[80%] mt-20 justify-center items-center">
          <div className="text-2xl justify-center items-center flex  font-bold italic px-4 py-6  border-l-4 border-primary">
            <p className="mb-4 text-justify">
              Adoption is a special process where a person or couple becomes the
              permanent parent(s) of a child who isn't biologically theirs. It
              means giving the child a loving home and the same care and rights
              as a biological parent would. Adoption changes the child's life by
              offering them a new family and creates a meaningful connection
              between the child and their new parents. It's a gentle and caring
              way to build families and bring joy and stability to both the
              child and the adoptive parents.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center flex-col">


        <div className="h-[60vh] bg-primary w-[90%] rounded-xl justify-center items-center flex">
          <div className="w-[40%]  h-full flex justify-center items-center ">
            <img
              src="https://www.thefosteringnetwork.org.uk/sites/default/files/uploads/images/woman_reading_to_girl.jpg"
              alt=""
              className="w-[80%] h-[80%] rounded-lg "
            />
          </div>
          <div className="w-[60%]  h-full flex flex-col justify-center text-white items-center p-20 font-semibold">
            <div>
              Adopting Sarah has been a transformative and deeply fulfilling
              experience for me. From the moment she entered my life, Sarah
              brought an unparalleled joy and a sense of completeness to my
              family. Her laughter and vibrant spirit have filled our home with
              a warmth and happiness I never imagined possible. Watching her
              grow and flourish has been a source of immense pride and
              fulfillment. Sarah's presence has not only enriched my life but
              has also woven a beautiful tapestry of love and connection,
              completing our family in the most profound way. Her adoption was a
              journey of love and commitment, and every day with her reaffirms
              how blessed and fortunate I am to have her as my daughter.
            </div>
          </div>
        </div>
    
   
        <div className="h-[60vh] w-full flex">
          
          <div className="w-[60%]  h-full flex flex-col justify-center items-center p-20 font-semibold">
            <div>
              Adopting Liam has been a dream come true. From the first day he
              joined our family, his curiosity and enthusiasm brought a new
              energy into our lives. His vibrant personality and infectious
              laughter have turned our house into a home filled with joy. Seeing
              him thrive and achieve his milestones has been incredibly
              rewarding. Every moment with Liam has strengthened our bond, and
              his presence has made our family feel complete in ways we never
              expected. His adoption has been a beautiful journey, filled with
              love and cherished memories.
            </div>
          </div>
          <div className="w-[40%]  h-full flex justify-center items-center ">
            <img
              src="https://www.thefosteringnetwork.org.uk/sites/default/files/uploads/images/woman_reading_to_girl.jpg"
              alt=""
              className="w-[80%] h-[80%] rounded-lg "
            />
          </div>
        </div>
     
        <div className="h-[60vh] bg-primary w-[90%] rounded-xl justify-center items-center flex">
          <div className="w-[40%]  h-full flex justify-center items-center ">
            <img
              src="https://www.thefosteringnetwork.org.uk/sites/default/files/uploads/images/woman_reading_to_girl.jpg"
              alt=""
              className="w-[80%] h-[80%] rounded-lg "
            />
          </div>
          <div className="w-[60%]  h-full flex flex-col justify-center text-white items-center p-20 font-semibold">
            <div>
              Adopting Sarah has been a transformative and deeply fulfilling
              experience for me. From the moment she entered my life, Sarah
              brought an unparalleled joy and a sense of completeness to my
              family. Her laughter and vibrant spirit have filled our home with
              a warmth and happiness I never imagined possible. Watching her
              grow and flourish has been a source of immense pride and
              fulfillment. Sarah's presence has not only enriched my life but
              has also woven a beautiful tapestry of love and connection,
              completing our family in the most profound way. Her adoption was a
              journey of love and commitment, and every day with her reaffirms
              how blessed and fortunate I am to have her as my daughter.
            </div>
          </div>
        </div>
      
     
        <div className="h-[60vh] w-full flex">
          
          <div className="w-[60%]  h-full flex flex-col justify-center items-center p-20 font-semibold">
            <div>
              Adopting Liam has been a dream come true. From the first day he
              joined our family, his curiosity and enthusiasm brought a new
              energy into our lives. His vibrant personality and infectious
              laughter have turned our house into a home filled with joy. Seeing
              him thrive and achieve his milestones has been incredibly
              rewarding. Every moment with Liam has strengthened our bond, and
              his presence has made our family feel complete in ways we never
              expected. His adoption has been a beautiful journey, filled with
              love and cherished memories.
            </div>
          </div>
          <div className="w-[40%]  h-full flex justify-center items-center ">
            <img
              src="https://www.thefosteringnetwork.org.uk/sites/default/files/uploads/images/woman_reading_to_girl.jpg"
              alt=""
              className="w-[80%] h-[80%] rounded-lg "
            />
          </div>
        </div>
     
      </div>

  
        




    </div>
  );
};

export default UserFostering;
