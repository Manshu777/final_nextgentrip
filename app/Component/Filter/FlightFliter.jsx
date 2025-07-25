import React,{useState} from "react";
import { FaPlane, FaMoneyBillWave, FaSun,FaMoon, FaPlaneDeparture, FaFilter } from 'react-icons/fa';

const FlightFliter = ({airlines,handelFilter,handelnonstop}) => {
 
  const [filters, setFilters] = useState({
    nonStop: false,
    refundableFares: false,
    indiGo: false,
    morningDepartures: false,
  });

  const filterOptions = ["All", "Morning", "Evening", ...airlines];


  const handleFilterChange = (event) => {
    const { name, checked } = event.target;
  
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));


  };


  return (
    <> 

       <div className="h-full sticky top-24 bg-gradient-to-b from-white to-gray-50 myshadow px-6 py-6 w-full rounded-xl shadow-lg">
      <div className="mb-">
        <p className="font-extrabold text-[12px] mt-3 mb-2 text-gray-800 flex items-center">
          <FaFilter className="mr-3 text-blue-500" /> Popular Filters
        </p>
       
       
        


        <div data-testid="morning-filter" className="flex justify-between w-full mb-2">
        <span className="checkmarkOuter flex items-center">
          <input
            type="radio"
            className="mr-3 h-3 w-3 accent-blue-500"
            name="timeFilter"
            value="Morning"
            onChange={(e) => handelFilter(e.target.value)}
          />
          <label className="font-medium text-[12px] text-gray-700 font-sans flex items-center">
            <FaSun className="mr-2 text-yellow-500" /> Morning Departures
          </label>
        </span>
      </div>

      <div data-testid="evening-filter" className="flex justify-between w-full mb-6">
        <span className="checkmarkOuter flex items-center">
          <input
            type="radio"
            className="mr-3 h-3 w-3 accent-blue-500"
            name="timeFilter"
            value="Evening"
            onChange={(e) => handelFilter(e.target.value)}
          />
          <label className="font-medium text-[12px] text-gray-700 font-sans flex items-center">
            <FaMoon className="mr-2 text-purple-500" /> Evening Departures
          </label>
        </span>
      </div>

      </div>

       
      <div className="mb-8">
        <p className="font-extrabold text-[12px] mb-2 text-gray-800 flex items-center">
          <FaPlane className="mr-3 text-blue-500" /> Stops
        </p>
        <div data-testid="" className="flex justify-between w-full mb-2">
          <span className="checkmarkOuter flex items-center">
            <input type="radio" className="mr-3 h-3 w-3 accent-blue-500" id="nonstop" name="nonstop" value="direct" onChange={(e)=>handelnonstop(e)} />
            <label htmlFor="nonstop" className="font-medium text-[12px] text-gray-700 font-sans flex items-center">
              <FaPlane className="mr-2 text-blue-500" /> Non Stop
            </label>
          </span>
        </div>
        <div data-testid="" className="flex justify-between w-full mb-5">
          <span className="checkmarkOuter flex items-center">
            <input type="radio" className="mr-3 h-3 w-3 accent-blue-500" name="nonstop" id="1stop" value="indirect" onChange={(e)=>handelnonstop(e)} />
            <label htmlFor="1stop" className="font-medium text-[12px] text-gray-700 font-sans flex items-center">
              <FaPlane className="mr-2 text-blue-500" /> 1 Stop
            </label>
          </span>
        </div>
      </div>

      <div className="mb-4">
        <p className="font-extrabold text-[12px] mb-3 text-gray-800 flex items-center">
          <FaPlaneDeparture className="mr-3 text-indigo-500" /> Airlines
        </p>
        <div data-testid="" className="flex justify-between w-full mb-2">
          <span className="checkmarkOuter flex items-center">
            <input type="radio" name="airlines" className="mr-3 h-3 w-3 accent-blue-500" id="All" value="All" onClick={(e)=>handelFilter(e.target.value,e.target.checked)} />
            <label htmlFor="All" className="font-medium text-[12px] text-gray-700 font-sans flex items-center">
              <FaPlane className="mr-2 text-blue-500" /> All
            </label>
          </span>
          <p className="text-[12px] text-gray-500"></p>
        </div>
        {!airlines.length ? "" : airlines.map((info) => {
          return (
            <div data-testid="" className="flex justify-between w-full mb-2" key={info}>
              <span className="checkmarkOuter flex items-center">
                <input type="radio" className="mr-3 h-3 w-3 accent-blue-500" id={info} name="airlines" value={info} onClick={(e)=>handelFilter(e.target.value)} />
                <label htmlFor={info} className="font-medium text-[12px] text-gray-700 font-sans flex items-center">
                  <FaPlaneDeparture className="mr-2 text-indigo-500" /> {info}
                </label>
              </span>
              <p className="text-[12px] text-gray-500"></p>
            </div>
          )
        })}
      </div>
    </div>
   
    </>
  );
};

export default FlightFliter;
