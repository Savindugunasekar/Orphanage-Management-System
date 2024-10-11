import React from "react";
import ReactSlider from "react-slider"; // Correct import
import "./AgeSlider.css"; // Import the CSS for slider styling

const AgeSlider = ({ ageRange, setAgeRange }) => { // Receive ageRange and setAgeRange as props
  const min = 0;
  const max = 18;

  return (
    <div className="flex flex-row px-2 justify-center items-center z-0">
      <div className="mx-3">Age</div>
      <label className="mx-3">{ageRange[0]}</label>
      <ReactSlider
        value={ageRange ? ageRange : [min, max]} // Use ageRange from props
        min={min}
        max={max}
        onChange={setAgeRange} // Use setAgeRange to update the state
        className="slider"
        thumbClassName="thumb"
        trackClassName="track"
      />
      <label className=" mx-3">{ageRange[1]}</label>
    </div>
  );
};

export default AgeSlider;
