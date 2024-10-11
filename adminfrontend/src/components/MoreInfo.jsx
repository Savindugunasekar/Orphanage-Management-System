import React from 'react'
import UserApplicationList from './User Dashboard/UserApplicationList'

export default function Myapplications() {
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-center my-10 relative">
          Applications
          <span className="block w-[100px] h-1 bg-primary mx-auto mt-3"></span>
        </h1>
        <UserApplicationList />

      </div>
    </div>
  )
}
