import React from "react";

const Search = ({ searchTerm, setSearchTerm }) => {

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <div className="flex justify-start items-left h-[50px] bg-gray-50 rounded overflow-hidden">
        <i className="fa-solid fa-magnifying-glass my-auto ml-3"></i>
        <input
          type="text"
          placeholder="Search by name.."
          value={searchTerm}
          onChange={handleInputChange}
          className="border-0 outline-none p-2 bg-gray-50 focus:border-orange-500 focus:ring-0 focus:ring-orange-500 w-full"
        />
      </div>

    </div>

  );
};

export default Search;
