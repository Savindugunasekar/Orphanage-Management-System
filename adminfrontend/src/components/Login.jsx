import React, { useEffect, useRef, useState } from "react";
import useAuth from "../hooks/useAuth";
import { Link, Route, useLocation, useNavigate } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import axios, { axiosPrivate } from "../api/axios";
import { jwtDecode } from "jwt-decode";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import PrimaryButton from "./elements/PrimaryButton";
import LoginCover from "../assets/images/login.png";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setFormError("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
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
      setLoading(false);
      setEmail("");
      setPassword("");
      toast.success("Login Successful");
      // Check roles to navigate
      if (roles.includes(ROLES.Admin)) navigate("/admin", { replace: true });
      else if (roles.includes(ROLES.Head) || roles.includes(ROLES.SocialWorker) || roles.includes(ROLES.Staff)) navigate(`/orphanage/${orphanageId}`, { replace: true });
      else navigate(`/user/dashboard`, { replace: true });


    } catch (err) {
      setLoading(false);
      if (!err?.response) {
        toast.error("No Server Response");
        setFormError("No Server Response");
      } else if (err.response?.status === 400) {
        toast.error("Missing Email or Password");
        setFormError("Missing Username or Password");
      } else if (err.response?.status === 401) {
        toast.error("Unauthorized");
        setFormError("Unauthorized");
      } else {
        toast.error("Login Failed");
        setFormError("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <section className="flex flex-row  align-middle lg:h-screen sm:p-10 bg-orange-50 overflow-y-auto">
      <div className="rounded-lg drop-shadow-lg  container px-6 py-6 m-auto h-full bg-white">
        <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
          {/* <!-- Left column container with background--> */}
          <div className="relative mb-12 md:mb-0 md:w-8/12 lg:w-6/12 lg:h-full">
            <img
              src="https://weareworldchallenge.com/wp-content/uploads/2024/01/Orphanages.jpg"
              className="w-full filter-orange-500 rounded-lg shadow-lg h-full object-cover"
              alt="Phone image"
            />
            <div className="absolute inset-0 flex items-center justify-center">

            </div>
          </div>


          {/* <!-- Right column container with form --> */}
          <div className="w-full md:w-8/12 lg:ml-6 lg:w-5/12 h-full overflow-y-auto sm:p-5 lg:pt-10">
            <h1 className="mb-10 text-4xl font-bold text-center text-orange-500 mx-auto w-fit">Login</h1>

            <form className="flex flex-col gap-5 p-5 backdrop-blur-lg rounded-xl">
              <div className="flex flex-col w-full">
                <h1 className="mb-5 text-xl">Please login to your account</h1>
                <label className="mb-2 text-lg font-semibold text-primary" htmlFor="email">
                  Email:
                </label>
                <input
                  className="w-full h-12 px-4 py-3 border rounded-md  bg-opacity-20 lg:opacity-100  focus:border-primary focus:outline-none focus:ring-1 focus:ring-orange-500"
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
                  className="w-full h-12 px-4 py-3 border rounded-md  bg-opacity-20 lg:opacity-100  focus:border-primary focus:outline-none focus:ring-1 focus:ring-orange-500"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  value={password}
                  required
                />
              </div>

              <div className="items-center justify-between mt-6 ">
                <PrimaryButton
                  text={'Log in'}
                  onClick={handleSubmit}
                  disabled={email === "" || password === ""}
                  loading={loading}
                  className={'w-full mb-5  py-3'} />


                <div className="mt-5 text-gray-700">
                  Don't have an account?{" "}
                  <span className="underline cursor-pointer text-primary">
                    <Link to={"/register"}>Sign Up</Link>
                  </span>
                </div>
              </div>
              <p ref={errRef} className={formError ? "font-semibold text-md text-red-500 mb-5" : "hidden"}>
                {formError}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>


  );
};

export default Login;
