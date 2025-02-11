import React from "react";
import { FaClock,FaArrowUp, FaArrowDown } from "react-icons/fa";

const AverageTimeCard = ({data}) => {
    const change = data?.change || 0;
    const isPositiveChange = change > 0;
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-gray-200 rounded-full">
          <FaClock className="text-gray-700 text-1xl" />
        </div>
        <div>
          <h2 className="text-1xl">Average Time</h2>
          <p className="text-2xl font-semibold">{data?.current}</p>
        </div>
      </div>
   <div className="mt-4 flex items-center space-x-2">
         {isPositiveChange ? (
           <FaArrowUp className="text-green-500" />
         ) : (
           <FaArrowDown className="text-red-500" />
         )}
         <p className={`text-sm `}>
           {change}%
         </p>
       </div>
    </div>
  );
};

export default AverageTimeCard;