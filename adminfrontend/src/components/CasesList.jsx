import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import Loading from './Loading';
import PrimaryButton from './elements/PrimaryButton';

const ROLES = {
  User: 1010,
  Head: 1910,
  SocialWorker: 2525,
  Admin: 7788,
};

const CasesList = () => {
  const navigate = useNavigate()
  const { id } = useParams();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAllCases = async () => {
      try {
        const response = await axiosPrivate.get(`/case?orphanageid=${id}`);
        setCases(response.data.casesList);
      } catch (error) {
        console.error('Failed to fetch cases:', error);
      }
      setIsLoading(false)
    };

    getAllCases();
  }, [id, axiosPrivate]);

  // Filter cases based on user role
  let filteredCases = cases;
  if (!auth.roles.includes(ROLES.Head)) {
    filteredCases = cases.filter(caseItem => caseItem.socialworkerid === auth.userId);
  }

  return (
    <>
      {isLoading ? (<Loading />) :
        <div className='mx-2'>
          <h1 className='text-4xl font-bold text-center text-gray-800 my-2'>Adoption Cases</h1>
          {filteredCases.map((caseItem, index) => (
            <div key={index} className="py-2">
              <div className="card bg-transparent border border-orange-900 rounded-md text-black w-full">
                <div className="card-body">
                  <h2 className="card-title"> child name : {caseItem.childName} </h2>
                  <p >social worker : {caseItem.socialWorkerName}</p>
                  <p >parent name : {caseItem.parentName}</p>

                  <div className="card-actions justify-end">
                    <PrimaryButton
                      text='view'
                      onClick={() => navigate(`/orphanage/${id}/case/${caseItem.caseid}`)} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>}
    </>
  );
};

export default CasesList;
