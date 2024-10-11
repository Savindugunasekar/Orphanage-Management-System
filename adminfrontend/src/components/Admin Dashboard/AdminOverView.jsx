import React, { useEffect, useState } from 'react'
import DashboardCard from '../elements/DashboardCard'
import { FaChildren } from 'react-icons/fa6'
import { FaHome } from "react-icons/fa";

export const AdminOverView = ({ overview }) => {



    return (
        <div className='items-center justify-center'>
            <h1 className='text-4xl font-bold text-center text-gray-800'>Overview</h1>

            <div className='flex items-center justify-center mt-10'>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10'>

                    {overview.map((item, index) => {
                        return (
                            <DashboardCard key={index} title={item.value} text={item.parameter} icon={item.icon} iconColor={item.color} />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
