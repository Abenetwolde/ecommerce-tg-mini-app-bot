import React, { useState } from "react";
import { FaFileAlt, FaMapMarkerAlt, FaExternalLinkAlt, FaTabletAlt, FaGlobe, FaCity, FaWindows, FaChrome } from "react-icons/fa";

const tabs = [
  { name: "Pages", icon: <FaFileAlt /> },
  { name: "Locations", icon: <FaMapMarkerAlt /> },
  { name: "Referrers", icon: <FaExternalLinkAlt /> },
  { name: "Devices", icon: <FaTabletAlt /> },
];

const subTabs = {
  Locations: [
    { name: "Country", icon: <FaGlobe /> },
    { name: "City", icon: <FaCity /> },
  ],
  Devices: [
    { name: "OS", icon: <FaWindows /> },
    { name: "Browser", icon: <FaChrome /> },
  ],
};

const AnalyticsDashboard = ({ data }) => {
  // const { data } = apiData;
  const [activeTab, setActiveTab] = useState("Pages");
  const [activeSubTab, setActiveSubTab] = useState("");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (subTabs[tab]) setActiveSubTab(subTabs[tab][0].name);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Pages":
        return (
          <div>
            {data.pages.map((page, index) => (
              <div key={index} className="border-b border-gray-300 py-3 flex justify-between">
                <p>{page.page}</p>
                <p className="text-gray-500">{page.visits} visits</p>
              </div>
            ))}
          </div>
        );
      case "Devices":
      case "Locations":
        return (
          <div className="mt-3 ml-3 ">
            <div className="bg-gray-200 w-fit  p-2 rounded-lg">
              <div className="flex space-x-4">
                {subTabs[activeTab].map(({ name, icon }) => (
                  <button
                    key={name}
                    onClick={() => setActiveSubTab(name)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-300 ${
                      activeSubTab === name ? "bg-gray-500 text-white" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {icon}
                    <span>{name}</span>
                  </button>
                ))}
              </div>
            </div>

            {activeSubTab === "OS" &&
              data.os.map((os, index) => (
                <div key={index} className="border-b border-gray-300 py-3 flex justify-between">
                  <p>{os.os}</p>
                  <p className="text-gray-500">{os.visits} visits</p>
                </div>
              ))}

            {activeSubTab === "Browser" &&
              data.browser.map((browser, index) => (
                <div key={index} className="border-b border-gray-300 py-3 flex justify-between">
                  <p>{browser.browser}</p>
                  <p className="text-gray-500">{browser.visits} visits</p>
                </div>
              ))}

            {activeSubTab === "Country" &&
              data.locations.country.map((location, index) => (
                <div key={index} className="border-b border-gray-300 py-3 flex justify-between">
                  <p>{location.location}</p>
                  <p className="text-gray-500">{location.visits} visits</p>
                </div>
              ))}

            {activeSubTab === "City" &&
              data.locations.city.map((location, index) => (
                <div key={index} className="border-b border-gray-300 py-3 flex justify-between">
                  <p>{location.location}</p>
                  <p className="text-gray-500">{location.visits} visits</p>
                </div>
              ))}
          </div>
        );
      case "Referrers":
        return (
          <div>
            {data.referrer.map((ref, index) => (
              <div key={index} className="border-b border-gray-300 py-3 flex justify-between">
                <p>{ref.referrer}</p>
                <p className="text-gray-500">{ref.visits} visits</p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 text-gray-900" >
      <div className="bg-gray-200 p-2 rounded-lg">
        <div className="flex justify-between">
          {tabs.map(({ name, icon }) => (
            <button
              key={name}
              onClick={() => handleTabChange(name)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-300 ${
                activeTab === name ? "bg-gray-500 text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {icon}
              <span>{name}</span>
            </button>
          ))}
        </div>
      </div>

      {renderContent()}

      <p className="text-gray-500 mt-4">Your analytics dashboard provides insights into visits and sources.</p>
    </div>
  );
};

export default AnalyticsDashboard;
