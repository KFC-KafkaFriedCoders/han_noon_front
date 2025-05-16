import React, { useState } from "react";
import { FaTerminal } from "react-icons/fa";

const CommandInput = () => {
  const franchiseOptions = [
    "더 본 코리아",
    "백다방",
    "한신포차",
    "백스비어",
    "빽보이피자",
    "역전우동",
    "홍콩반점",
  ];

  const [selectedFranchise, setSelectedFranchise] = useState("더 본 코리아");

  const handleExecute = () => {
    console.log("Executing commands for:", selectedFranchise);
  };

  return (
    <div className="my-4">
      <div></div>
      <div className="flex items-center mb-2 bg-gray-900 rounded p-2 group">
        <div className="text-gray-400 mr-2">
          <FaTerminal />
        </div>
        <select
          value={selectedFranchise}
          onChange={(e) => setSelectedFranchise(e.target.value)}
          className="flex-grow bg-transparent border-none focus:outline-none text-gray-300"
        >
          {franchiseOptions.map((option, idx) => (
            <option
              key={idx}
              value={option}
              style={{
                backgroundColor: "#1f2937",
                color: "white",
              }}
            >
              {option}
            </option>
          ))}
        </select>
        <button
          onClick={handleExecute}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded font-medium"
        >
          Execute
        </button>
      </div>
    </div>
  );
};

export default CommandInput;
