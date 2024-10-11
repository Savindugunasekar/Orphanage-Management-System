import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Search from "./Search";
import AgeSlider from "./AgeSlider";
import ChildTable from "./ChildTable";
import { ChildForm } from "./ChildForm";

import useAxiosPrivate from '../hooks/useAxiosPrivate'
import PrimaryButton from "./elements/PrimaryButton";

const Children = ({ role }) => {


  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate()

  const [searchTerm, setSearchTerm] = useState('');
  const [ageRange, setAgeRange] = useState([0, 18]);
  const [gender, setGender] = useState('Select Gender');
  const [formVisibility, setFormVisibility] = useState(false);
  const [children, setChildren] = useState([]);
  const [filteredChildren, setFilteredChildren] = useState([]);

  const handleAddChild = () => {
    setFormVisibility(!formVisibility);
  };

  const getAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (age > 0 && (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))) {
      return age - 1;
    }
    return age;
  }

  const addAge = (children) => {
    return children.map((child) => {
      return { ...child, age: getAge(child.date_of_birth) }
    })

  }

  const getChildren = async () => {
    try {
      const response = await axiosPrivate.get(`/child/orphanage/${id}`);

      setChildren(addAge(response.data.childrenList))

    } catch (error) {
      console.error("Failed to fetch children:", error);
    }
  };

  const navigate = useNavigate();

  const handleViewChild = (child) => {
    navigate(`/orphanage/${id}/child/${child.childid}`);
  }


  useEffect(() => {

    if (!searchTerm && gender === 'Select Gender') {
      setFilteredChildren(children.filter((child) => {
        return child.age >= ageRange[0] && child.age <= ageRange[1]
      }));
      return;
    }
    else if (!searchTerm) {
      setFilteredChildren(children.filter((child) => {
        return child.gender === gender && child.age >= ageRange[0] && child.age <= ageRange[1]
      }))
    }
    else if (gender === 'Select Gender') {
      setFilteredChildren(children.filter((child) => {
        return child.name.toLowerCase().includes(searchTerm.toLowerCase()) && child.age >= ageRange[0] && child.age <= ageRange[1]
      }));
    }
    else {
      setFilteredChildren(children.filter((child) => {
        return child.name.toLowerCase().includes(searchTerm.toLowerCase()) && child.gender === gender && child.age >= ageRange[0] && child.age <= ageRange[1]
      }));
    }
  }, [searchTerm, gender, children, ageRange]);


  useEffect(() => {
    getChildren()
  }, [])

  return (
    <div >


      <div className="grid grid-cols-1 gap-8 mx-10 my-6  lg:grid-cols-4">
        <PrimaryButton onClick={handleAddChild} text='Add Child' disabled={role != 'Staff'} />
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <AgeSlider ageRange={ageRange} setAgeRange={setAgeRange} />
        <div>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="block w-full px-3 py-1 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-orange-500 focus:outline-none">
            <option>Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>
      </div>

      <h2 className="text-center text-2xl font-semibold">Children</h2>

      <div className=" m-10 mt-5 h-[65vh] overflow-y-auto  border">

        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead className="bg-slate-300">
              <tr>
                <th></th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th className="text-center">View</th>
              </tr>
            </thead>
            <tbody >
              {/* row 1 */}
              {filteredChildren.map((child, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{child.name}</td>
                  <td>{child.age}</td>
                  <td>{child.gender}</td>
                  <td className="flex flex-row justify-center"><PrimaryButton text='view' onClick={() => handleViewChild(child)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
      {formVisibility ? <ChildForm setFormVisibility={setFormVisibility} children={children} setChildren={setChildren} /> : null}
    </div>
  );
};

export default Children;
