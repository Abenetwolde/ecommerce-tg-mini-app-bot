import React, { useState } from "react";
import { FaCalendarAlt, FaChevronDown } from "react-icons/fa";

const DatePicker = ({ onDateChange }) => {
  const [selectedRange, setSelectedRange] = useState("Last 24 Hours");
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (range) => {
    setSelectedRange(range);
    setIsOpen(false);
    onDateChange(range);
  };

  const ranges = [
    "Last 24 Hours",
    "Yesterday",
    "This Week",
    "Last 7 Days",
    "This Month",
    "Last 30 Days",
    "Last 90 Days",
    "Custom",
  ];

  return (
    <div className="relative w-50">
      {/* Input Field as Dropdown Trigger */}
      <div className="relative">
        <input
          type="text"
          readOnly
          value={selectedRange}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-7 py-2 pr-10 bg-white border border-gray-300 rounded-md shadow-sm text-md font-medium text-gray-700 focus:outline-none focus:ring-0 hover:bg-gray-50 cursor-pointer"
        />
        <FaCalendarAlt className="absolute left-1 top-3 text-gray-500" />
        <FaChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full rounded-md shadow-lg bg-white border border-gray-200">
          <div className="py-1">
            {ranges.map((range) => (
              <button
                type="button"
                key={range}
                onClick={() => handleSelect(range)}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-left"
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
