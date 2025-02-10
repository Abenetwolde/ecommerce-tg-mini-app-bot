import React from "react";
import { FaClock,FaArrowUp, FaArrowDown } from "react-icons/fa";

const AverageTimeCard = ({data}) => {
    const change = data?.change || 0;
    const isPositiveChange = change > 0;
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-yellow-100 rounded-full">
          <FaClock className="text-yellow-500 text-2xl" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-700">Average Time</h2>
          <p className="text-2xl  text-gray-900">{data?.current}</p>
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