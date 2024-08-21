import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';

const ROLES = {
  User: 1010,
  Head: 1910,
  SocialWorker: 2525,
  Admin: 7788,
};

const CasesList = () => {
  const navigate = useNavigate()
  const { id } = useParams();
  const { auth} = useAuth(); 
  const axiosPrivate = useAxiosPrivate();
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const getAllCases = async () => {
      try {
        const response = await axiosPrivate.get(`/case?orphanageid=${id}`);
        setCases(response.data.casesList);  
      } catch (error) {
        console.error('Failed to fetch cases:', error);
      }
    };

    getAllCases();
  }, [id, axiosPrivate]);

  // Filter cases based on user role
  let filteredCases = cases;
  if (!auth.roles.includes(ROLES.Head)) {
    filteredCases = cases.filter(caseItem => caseItem.socialworkerid === auth.userId);
  }

  return (
    <div>
    <table className="min-w-full bg-white border-b text-center">
      <thead className='text-primary'>
        <tr>
          <th className="py-2 px-4 border-b">Child Name</th>
          <th className="py-2 px-4 border-b">Social Worker Name</th>
          <th className="py-2 px-4 border-b">Parent Name</th>
        </tr>
      </thead>
      <tbody>
        {filteredCases.map((caseItem) => (
          <tr
          onClick={()=>navigate(`/orphanage/${id}/case/${caseItem.caseid}`)}
            key={caseItem.caseid}
            className="cursor-pointer hover:bg-gray-100"
          >
            <td className="py-3 px-4 border-b">{caseItem.childName}</td>
            <td className="py-3 px-4 border-b">{caseItem.socialWorkerName}</td>
            <td className="py-3 px-4 border-b">{caseItem.parentName}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
  
  );
};

export default CasesList;
