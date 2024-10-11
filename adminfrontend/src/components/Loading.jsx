import React from 'react'
import logo from '../assets/images/logo.png'

const Loading = () => {
  return (
    <div className="relative flex justify-center items-center h-screen z-50">
      <div className="absolute border-8 border-gray-200 border-t-primary border-solid rounded-full w-36 h-36 animate-spin"></div>
      <img src={logo} alt="Logo" className="relative w-24 h-auto" />
    </div>
  )
}

export default Loading