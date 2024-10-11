import React, { useEffect, useRef, useState } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import toast from "react-hot-toast";
import PrimaryButton from "./elements/PrimaryButton";

// Username and Password Regex for validation
const USERNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
// Phone Number Regex for validation (example: US format)
const TELNO_REGEX = /^\d{10}$/;

// Email Regex for validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = () => {
  const navigate = useNavigate();

  const usernameRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [telno, setTelNo] = useState("");
  const [validTelNo, setValidTelNo] = useState(false);
  const [telnoFocus, setTelNoFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    usernameRef.current.focus();
  }, []);
  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);
  useEffect(() => {
    setValidName(USERNAME_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidTelNo(TELNO_REGEX.test(telno));
  }, [telno]);

  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password));
    setValidMatch(password === matchPassword);
  }, [password, matchPassword]);

  useEffect(() => {
    setFormError("");
  }, [username, email, password, matchPassword, telno]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "/register",
        JSON.stringify({ username, email, password, telno }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log(JSON.stringify(response?.data));

      setSuccess(true);
      setUsername("");
      setPassword("");
      setMatchPassword("");
      setTelNo("");
      setEmail("");
      setLoading(false);
      toast.success('Registration Successful')
      navigate("/login", { replace: true });

    } catch (error) {
      if (!error?.response) {
        setFormError("No Server Response");
        toast.error("No Server Response")
      } else if (error.response?.status === 409) {
        setFormError("Username Taken");
        toast.error("Username Taken")
      } else if (error.response?.status === 403) {
        setFormError("User Already Exists");
        toast.error("User Already Exists")
      } else {
        setFormError("Registration Failed");
        toast.error("Registration Failed")
      }
      errRef.current.focus();
      setLoading(false);
    }
  };

  return (

    <section className="flex flex-row  align-middle lg:h-screen sm:p-10 bg-orange-50 overflow-y-auto">
      <div className="rounded-lg drop-shadow-lg  container px-6 py-6 m-auto h-full bg-white">
        <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
          {/* Left Side: Image */}
          <div className="relative mb-12 md:mb-0 md:w-8/12 lg:w-6/12 lg:h-full">
            <img
              src="https://weareworldchallenge.com/wp-content/uploads/2024/01/Orphanages.jpg"
              className="w-full filter-orange-500 rounded-lg shadow-lg h-full object-cover"
              alt="Phone image" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-white text-4xl sm:text-6xl border font-bold drop-shadow-xl p-2">OrphanCare</h2>
            </div>
          </div>

          {/* Right Side: Register Form */}
          <div className="w-full md:w-8/12 lg:ml-6 lg:w-5/12 h-full overflow-y-auto sm:p-5 lg:pt-10">
            <h1 className="mb-10 text-4xl font-bold text-center text-orange-500 mx-auto w-fit">Register</h1>
            <p ref={errRef} className={formError ? "font-semibold text-md text-red-500 mb-5" : "hidden"}> {formError} </p>
            <form className="flex flex-col gap-5 backdrop-blur-lg p-5 rounded-xl">
              {/* Username Field */}
              <div className="flex flex-col w-full">
                <label className="text-lg font-semibold mb-2 text-primary" htmlFor="username">
                  Username:
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={validName ? "text-green-600 ml-2" : "hidden"}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={
                      validName || !username ? "hidden" : "text-red-700 ml-2"
                    }
                  />
                </label>
                <input
                  className="w-full h-12 px-4 py-3 border rounded-md  bg-opacity-20 lg:opacity-100  focus:border-primary focus:outline-none focus:ring-1 focus:ring-orange-500"
                  type="text"
                  id="username"
                  ref={usernameRef}
                  autoComplete="off"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  required
                  onFocus={() => setUserFocus(true)}
                  onBlur={() => setUserFocus(false)}
                />
                <p
                  id="uidnote"
                  className={
                    userFocus && username && !validName
                      ? "text-xs rounded-md bg-black text-white px-1 py-0.5 mt-1"
                      : "hidden"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  4 to 24 characters.
                  <br />
                  Must begin with a letter.
                  <br />
                  Letters, numbers, underscores, hyphens allowed.
                </p>
              </div>

              {/* Email Field */}
              <div className="flex flex-col w-full">
                <label className="text-lg font-semibold mb-2 text-primary" htmlFor="email">
                  Email:
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={validEmail ? "text-green-600 ml-2" : "hidden"}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={
                      validEmail || !email ? "hidden" : "text-red-700 ml-2"
                    }
                  />
                </label>
                <input
                  className="w-full h-12 px-4 py-3 border rounded-md  bg-opacity-20 lg:opacity-100  focus:border-primary focus:outline-none focus:ring-1 focus:ring-orange-500"
                  type="email"
                  id="email"
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                />
                <p
                  id="emailnote"
                  className={
                    emailFocus && email && !validEmail
                      ? "text-xs rounded-md bg-black text-white px-1 py-0.5 mt-1"
                      : "hidden"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Must be a valid email address.
                </p>
              </div>

              {/* Phone Number Field */}
              <div className="flex flex-col w-full">
                <label className="text-lg font-semibold mb-2 text-primary" htmlFor="telno">
                  Phone Number:
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={validTelNo ? "text-green-600 ml-2" : "hidden"}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={
                      validTelNo || !telno ? "hidden" : "text-red-700 ml-2"
                    }
                  />
                </label>
                <input
                  className="w-full h-12 px-4 py-3 border rounded-md  bg-opacity-20 lg:opacity-100  focus:border-primary focus:outline-none focus:ring-1 focus:ring-orange-500"
                  type="text"
                  id="telno"
                  autoComplete="off"
                  onChange={(e) => setTelNo(e.target.value)}
                  value={telno}
                  required
                  onFocus={() => setTelNoFocus(true)}
                  onBlur={() => setTelNoFocus(false)}
                />
                <p
                  id="telnote"
                  className={
                    telnoFocus && telno && !validTelNo
                      ? "text-xs rounded-md bg-black text-white px-1 py-0.5 mt-1"
                      : "hidden"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Must be a valid 10-digit phone number.
                </p>
              </div>

              {/* Password Field */}
              <div className="flex flex-col w-full">
                <label className="text-lg font-semibold mb-2 text-primary" htmlFor="password">
                  Password:
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={validPassword ? "text-green-600 ml-2" : "hidden"}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={
                      validPassword || !password ? "hidden" : "text-red-700 ml-2"
                    }
                  />
                </label>
                <input
                  className="w-full h-12 px-4 py-3 border rounded-md  bg-opacity-20 lg:opacity-100  focus:border-primary focus:outline-none focus:ring-1 focus:ring-orange-500"
                  type="password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                />
                <p
                  id="pwdnote"
                  className={
                    passwordFocus && !validPassword
                      ? "text-xs rounded-md bg-black text-white px-1 py-0.5 mt-1"
                      : "hidden"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  8 to 24 characters.
                  <br />
                  Must include uppercase and lowercase letters, a number, and a
                  special character.
                </p>
              </div>

              {/* Confirm Password Field */}
              <div className="flex flex-col w-full">
                <label className="text-lg font-semibold mb-2 text-primary" htmlFor="confirm_password">
                  Confirm:
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={validMatch && matchPassword ? "text-green-600 ml-2" : "hidden"}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={
                      validMatch || !matchPassword ? "hidden" : "text-red-700 ml-2"
                    }
                  />
                </label>
                <input
                  className="w-full h-12 px-4 py-3 border rounded-md  bg-opacity-20 lg:opacity-100  focus:border-primary focus:outline-none focus:ring-1 focus:ring-orange-500"
                  type="password"
                  id="confirm_password"
                  onChange={(e) => setMatchPassword(e.target.value)}
                  value={matchPassword}
                  required
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                />
                <p
                  id="confirmnote"
                  className={
                    matchFocus && !validMatch
                      ? "text-xs rounded-md bg-black text-white px-1 py-0.5 mt-1"
                      : "hidden"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Must match the first password input field.
                </p>
              </div>

              {/* Submit Button */}
              <PrimaryButton
                disabled={
                  !validName || !validPassword || !validMatch || !validTelNo
                }
                text={'Sign Up'}
                onClick={handleSubmit}
                className={'my-5  py-3'}
                loading={loading}
              />

              <p className="text-gray-700">
                Already registered?{" "}
                <span className="text-primary underline cursor-pointer">
                  <Link to="/login">Login</Link>
                </span>
              </p>
            </form>
          </div>
        </div>

      </div>
    </section >






  )
}


export default Register