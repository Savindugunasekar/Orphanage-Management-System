import React from 'react'
import { ChildAddFormStep1 } from './ChildAddFormStep1';
import { ChildAddFormStep2 } from './ChildAddFormStep2';
import { RiCloseLargeFill } from 'react-icons/ri';
const tabs = ['Information', 'Photo'];

export const ChildForm = ({ setFormVisibility }) => {

    const [currentTab, setCurrentTab] = React.useState(tabs[0]);
    const [reqId, setReqId] = React.useState('');

    const renderTabContent = () => {
        switch (currentTab) {
            case tabs[0]:
                return <ChildAddFormStep1 setTab={setCurrentTab} tabs={tabs} setReqId={setReqId} />;
            case tabs[1]:
                return <ChildAddFormStep2 reqId={reqId} setFormVisibility={setFormVisibility} />;
            default:
                return null;
        }
    }

    return (

        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm py-20 z-300">
            <div
                id="scrollview"
                className="bg-white rounded drop-shadow-lg w-fit h-fit mt-10 mx-10 border ">


                <div className="flex flex-row justify-between">
                    <h2 className="m-4 text-2xl font-semibold text-gray-800">Child Detail Form</h2>
                    {/* close button */}
                    <div className='flex flex-row justify-end my-auto mx-5'>
                        <RiCloseLargeFill
                            onClick={() => setFormVisibility(false)}
                            className='bg-red-500 rounded-full text-4xl p-2 text-white drop-shadow hover:bg-red-700' />
                    </div>
                </div>


                <div id="report" className="w-fit bg-gray-100 p-6">
                    {/* Mobile dropdown */}
                    <div className="sm:hidden">
                        <label className="text-white bg-black w-fit p-2 rounded-lg">
                            {currentTab}
                        </label>
                    </div>

                    {/* Desktop tabs */}
                    <div className="hidden sm:block ">
                        <div className="bg-orange-100 rounded ">
                            <nav className="-mb-px flex gap-1 justify-around p-1 overflow-auto " aria-label="Tabs">
                                {tabs.map((tab, index) => (
                                    <div
                                        key={tab}
                                        className={`shrink-0 p-2 m-auto font-semibold flex-1 rounded flex flex-row justify-start ${currentTab === tab
                                            ? "bg-orange-500  text-white drop-shadow"
                                            : "border-transparent text-black  bg-white"
                                            }`}
                                    >
                                        <p className='bg-orange-50 rounded-full w-6 h-6 my-auto mx-3 text-black text-center'>{index + 1}</p> {tab}
                                    </div>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Render tab content */}
                    <div className="mt-5">
                        {renderTabContent()}
                    </div>

                </div>


            </div>
        </div>
    )
}
