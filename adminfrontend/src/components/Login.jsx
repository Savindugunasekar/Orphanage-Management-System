import React, { useEffect, useRef, useState } from "react";
import useAuth from "../hooks/useAuth";
import { Link, Route, useLocation, useNavigate } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import axios, { axiosPrivate } from "../api/axios";
import { jwtDecode } from "jwt-decode";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import toast from "react-hot-toast";


const ROLES = {
  User: 1010,
  Head: 1910,
  Staff: 5528,
  SocialWorker: 2525,
  Admin: 7788,
};

const Login = () => {
  const { setAuth } = useAuth();

  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useLocalStorage("email", "");
  const [password, setPassword] = useState("");

  const [formError, setFormError] = useState("");

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setFormError("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "/login",
        JSON.stringify({ email, password }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // Debug log for response data
      console.log(JSON.stringify(response?.data));

      const accessToken = response?.data?.accessToken;
      const decoded = jwtDecode(accessToken);
      const roles = decoded?.UserInfo?.roles || [];

      const userId = decoded?.UserInfo?.userId;
      const orphanageId = decoded?.UserInfo?.orphanageid || null;
      const username = decoded?.UserInfo?.username;


      setAuth({ accessToken, roles, orphanageId, userId, username });


      setEmail("");
      setPassword("");
      toast.success("Login Successful");
      // Check roles to navigate
      if (roles.includes(ROLES.Admin)) navigate("/admin", { replace: true });
      else if (roles.includes(ROLES.Head) || roles.includes(ROLES.SocialWorker) || roles.includes(ROLES.Staff)) navigate(`/orphanage/${orphanageId}`, { replace: true });
      else navigate(`/userdash`, { replace: true });


    } catch (err) {
      if (!err?.response) {
        toast.error("No Server Response");
        //setFormError("No Server Response");
      } else if (err.response?.status === 400) {
        toast.error("Missing Username or Password");
        //setFormError("Missing Username or Password");
      } else if (err.response?.status === 401) {
        toast.error("Unauthorized");
        //setFormError("Unauthorized");
      } else {
        toast.error("Login Failed");
        //setFormError("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="hidden h-full lg:block lg:w-3/5">
        <div
          style={{
            backgroundImage: "url('https://weareworldchallenge.com/wp-content/uploads/2024/01/Orphanages.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",


          }}
          className="w-full h-full"
        >
          <h1 className="px-10 pt-48 text-6xl font-bold text-primary ">Join Our Journey: Adopt or Donate to Make a Difference</h1>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full h-full lg:w-2/5">

        <img className="relative object-cover w-full h-full lg:hidden" src="https://weareworldchallenge.com/wp-content/uploads/2024/01/Orphanages.jpg" alt="" />

        <div className="absolute w-full lg:w-2/5 sm:px-36 lg:px-10">
          <p
            ref={errRef}
            className={
              formError ? "font-semibold text-md text-red-500 mb-5" : "hidden"
            }
          >
            {formError}
          </p>

          <h1 className="mb-10 text-4xl font-bold text-center text-primary ">
            Log In
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5 backdrop-blur-lg rounded-xl">
            <div className="flex flex-col w-full">
              <label className="mb-2 text-lg font-semibold text-primary" htmlFor="email">
                Email:
              </label>
              <input
                className="w-full h-12 px-4 py-3 text-white bg-gray-200 border rounded-md lg:text-gray-700 bg-opacity-20 lg:opacity-100 lg:bg-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                type="email"
                ref={emailRef}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                value={email}
                required
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-2 text-lg font-semibold text-primary" htmlFor="password">
                Password:
              </label>
              <input
                className="w-full h-12 px-4 py-3 text-white bg-gray-200 border rounded-md lg:text-gray-700 bg-opacity-20 lg:opacity-100 lg:bg-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                value={password}
                required
              />
            </div>

            <div className="items-center justify-between mt-6 ">
              <button
                type="submit"
                className="w-full px-6 py-3 font-semibold text-white transition-all duration-300 border rounded-lg bg-primary hover:bg-white hover:text-primary border-primary"
              >
                Log in
              </button>

              <div className="mt-5 text-white lg:text-gray-700">
                Don't have an account?{" "}
                <span className="underline cursor-pointer text-primary">
                  <Link to={"/register"}>Sign Up</Link>
                </span>
              </div>
            </div>
          </form>
        </div>

      </div>
    </div>


  );
};

export default Login;
