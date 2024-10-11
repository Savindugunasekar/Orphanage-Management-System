import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';


const UserCaseList = () => {
    const axiosprivate = useAxiosPrivate();
    const navigate = useNavigate();
    const [cases, setCases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getUserCases = async () => {
            try {
                const response = await axiosprivate.get(`/case/byUser`);
                setCases(response.data.userCases);
            } catch (error) {
                console.error("Error fetching user cases:", error);
                setError("An error occurred while fetching cases.");
            } finally {
                setIsLoading(false);
            }
        };

        getUserCases();
    }, [axiosprivate]);

    return (
        <div className="p-6">
            {isLoading ? (
                <Loading/>
                
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : cases.length > 0 ? (
                <ul className="space-y-4">
                    {cases.map((userCase) => (
                        <li
                            key={userCase.caseid}
                            className="p-6 bg-white border border-gray-300 rounded-lg shadow-lg hover:bg-gray-50 cursor-pointer"
                            onClick={() => navigate(`/case/${userCase.caseid}`, { replace: true })}
                        >
                            <div className="mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">CaseID : {userCase.caseid}</h3>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="text-md font-medium text-gray-700">Child Name:</p>
                                    <p className="text-lg font-semibold text-gray-900">{userCase.childName}</p>
                                    <p className="text-md font-medium text-gray-700">Social Worker:</p>
                                    <p className="text-lg font-semibold text-gray-900">{userCase.socialWorkerName}</p>
                                </div>
                            </div>
                            <div className="mb-4">
                                <p className="text-md font-medium text-gray-700">Orphanage Name:</p>
                                <p className="text-lg font-semibold text-gray-900">{userCase.orphanageName}</p>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => navigate(`/case/${userCase.caseid}`)}
                                    className="px-4 py-2 bg-primary text-white rounded-md"
                                >
                                    View Details
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-600 text-center">No cases found.</p>
            )}
        </div>
    );
};

export default UserCaseList;
