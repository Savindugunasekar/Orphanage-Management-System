import React from "react";

const Search = ({ searchTerm, setSearchTerm }) => {

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>


      <input
        className="input input-bordered w-full max-w-xs mx-2"
        placeholder="Search"
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
      />

    </div>

  );
};

export default Search;
