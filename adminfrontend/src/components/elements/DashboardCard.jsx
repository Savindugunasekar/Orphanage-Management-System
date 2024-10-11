import React from 'react'

const DashboardCard = ({ title, text, icon, iconColor }) => {
    return (
        <div className="card bg-base-100  shadow-xl h-fit rounded-lg ">
            <figure className={`px-10 pt-10 text-5xl text-${iconColor ? iconColor : 'orange'}-500`}>
                <div className='bg-slate-100 rounded-full p-2 h-fit w-fit'>
                    {icon}
                </div>
            </figure>
            <div className="card-body items-center text-center">
                <h2 className="card-title text-4xl">{title}</h2>
                <p>{text}</p>
            </div>
        </div>
    )
}

export default DashboardCard