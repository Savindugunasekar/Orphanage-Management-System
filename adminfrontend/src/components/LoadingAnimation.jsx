import React from 'react'

const LoadingAnimation = () => {
    return (
        <div className="fixed inset-0 flex  justify-center bg-black bg-opacity-10 overflow-auto px-10 z-50">
            <div className="flex justify-center items-center h-fit m-auto py-6 px-10 rounded-lg bg-white ">
                <p className='font-medium mx-5'>Uploading </p>
                <div className="relative inline-flex">
                    <div className="w-8 h-8 bg-orange-500 rounded-full"></div>
                    <div className="w-8 h-8 bg-orange-500 rounded-full absolute top-0 left-0 animate-ping"></div>
                    <div classNames="w-8 h-8 bg-orange-500 rounded-full absolute top-0 left-0 animate-pulse"></div>
                </div>
            </div>
        </div>
    )
}

export default LoadingAnimation