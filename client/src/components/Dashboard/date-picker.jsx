import React, { useState } from "react";

const DatePicker = ({ onDateChange }) => {
  const [selectedRange, setSelectedRange] = useState("Last 24 Hours");
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (range) => {
    console.log("Selected range:", range);
    setSelectedRange(range);
    setIsOpen(false); // Close the dropdown after selection
    onDateChange(range); // Call the onDateChange function with the selected range
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
    <div className="relative">
      {/* Dropdown Trigger Button */}
      <button
          type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {selectedRange}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {ranges.map((range) => (
              <button
                            type="button"
                key={range}
                onClick={() => handleSelect(range)}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      )}
      <p className="text-sm text-gray-400 mt-2">{selectedRange}</p>
    </div>
  );
};

export default DatePicker;