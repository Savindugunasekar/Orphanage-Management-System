import React from 'react'
import { ChildAddFormStep1 } from './ChildAddFormStep1';
import { ChildAddFormStep2 } from './ChildAddFormStep2';
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
        <div className="fixed inset-0 flex  justify-center bg-black bg-opacity-50 overflow-auto px-10 z-10">
            <section className=" px-8 py-4 mx-auto bg-white rounded-md shadow-md my-5 w-[80vw]">

                <div className="flex justify-between items-center mb-3">
                    <h1 className=" font-sans text-2xl antialiased leading-snug text-black border-b-2 p-2 rounded">Child Detail Form</h1>
                    <button className="px-2 py-1 bg-red-500 text-white rounded-md" onClick={() => setFormVisibility(false)}>Close</button>
                </div>

                {/* Tab selection area */}
                <div className="relative mt-5 ">
                    {/* Mobile dropdown */}
                    <div className="sm:hidden">
                        <label htmlFor="Tab" className="sr-only">
                            Tab
                        </label>
                        <select
                            id="Tab"
                            className="w-full rounded-md border-gray-200"
                            value={currentTab}
                        >
                            {tabs.map((tab) => (
                                <option key={tab} value={tab}> </option>
                            ))}
                        </select>
                    </div>

                    {/* Desktop tabs */}
                    <div className="hidden sm:block ">
                        <div className="bg-orange-100 rounded ">
                            <nav className="-mb-px flex gap-1 justify-around p-1 overflow-auto" aria-label="Tabs">
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


            </section>
        </div>
    )
}
