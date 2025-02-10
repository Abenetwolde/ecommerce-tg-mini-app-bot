import React, { useState } from "react";

const AnalyticsDashboard = ({ data }) => {
  const [activeTab, setActiveTab] = useState("Devices");
  const [activeSubTab, setActiveSubTab] = useState("OS");

  const renderContent = () => {
    switch (activeTab) {
      case "Devices":
        return (
          <div className="space-y-4">
            <div className="flex space-x-4 border-b pb-2">
              {["OS", "Browser"].map((subTab) => (
                <button
                  key={subTab}
                  onClick={() => setActiveSubTab(subTab)}
                  className={`px-4 py-2 rounded-t-lg ${
                    activeSubTab === subTab
                      ? "bg-gray-800 text-white"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {subTab}
                </button>
              ))}
            </div>
            {activeSubTab === "OS" && (
              <div>
                <h3 className="font-semibold">OS</h3>
                {data.os.map((os, index) => (
                  <div key={index} className="bg-gray-900 p-4 rounded-lg shadow-md flex justify-between">
                    <p className="font-semibold text-white">{os.os}</p>
                    <p className="text-gray-400">{os.visits} visits</p>
                  </div>
                ))}
              </div>
            )}
            {activeSubTab === "Browser" && (
              <div>
                <h3 className="font-semibold">Browser</h3>
                {data.browser.map((browser, index) => (
                  <div key={index} className="bg-gray-900 p-4 rounded-lg shadow-md flex justify-between">
                    <p className="font-semibold text-white">{browser.browser}</p>
                    <p className="text-gray-400">{browser.visits} visits</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "Locations":
        return (
          <div className="space-y-4">
            <div className="flex space-x-4 border-b pb-2">
              {["Country", "City"].map((subTab) => (
                <button
                  key={subTab}
                  onClick={() => setActiveSubTab(subTab)}
                  className={`px-4 py-2 rounded-t-lg ${
                    activeSubTab === subTab
                      ? "bg-gray-800 text-white"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {subTab}
                </button>
              ))}
            </div>
            {activeSubTab === "Country" && (
              <div>
                <h3 className="font-semibold">Country</h3>
                {data.locations.country.map((location, index) => (
                  <div key={index} className="bg-gray-900 p-4 rounded-lg shadow-md flex justify-between">
                    <p className="font-semibold text-white">{location.location}</p>
                    <p className="text-gray-400">{location.visits} visits</p>
                  </div>
                ))}
              </div>
            )}
            {activeSubTab === "City" && (
              <div>
                <h3 className="font-semibold">City</h3>
                {data.locations.city.map((location, index) => (
                  <div key={index} className="bg-gray-900 p-4 rounded-lg shadow-md flex justify-between">
                    <p className="font-semibold text-white">{location.location}</p>
                    <p className="text-gray-400">{location.visits} visits</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "Referrers":
        return (
          <div className="space-y-4">
            <div className="flex space-x-4 border-b pb-2">
              {["Referrer", "Domain"].map((subTab) => (
                <button
                  key={subTab}
                  onClick={() => setActiveSubTab(subTab)}
                  className={`px-4 py-2 rounded-t-lg ${
                    activeSubTab === subTab
                      ? "bg-gray-800 text-white"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {subTab}
                </button>
              ))}
            </div>
            {activeSubTab === "Referrer" && (
              <div>
                <h3 className="font-semibold">Referrer</h3>
                {data.referrer.map((ref, index) => (
                  <div key={index} className="bg-gray-900 p-4 rounded-lg shadow-md flex justify-between">
                    <p className="font-semibold text-white">{ref.referrer}</p>
                    <p className="text-gray-400">{ref.visits} visits</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-black text-white">
      <div className="flex space-x-4 mb-6 border-b pb-2">
        {["Pages", "Locations", "Referrers", "Devices"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-lg ${
              activeTab === tab
                ? "bg-gray-800 text-white"
                : "bg-gray-700 text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {renderContent()}
      <p className="text-gray-400 mt-4">Your analytics dashboard provides insights into visits and sources.</p>
    </div>
  );
};

export default AnalyticsDashboard;
