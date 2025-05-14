import React, { useState } from "react";
import { FaTerminal, FaEllipsisV } from "react-icons/fa";

const CommandInput = () => {
  const [franchiseOptions, setFranchiseOptions] = useState([]);
  const [storeOptions, setStoreOptions] = useState([]);

  const handleExecute = () => {
    console.log("Executing commands:");
  };

  return (
    <div className="my-4">
      <div className="flex items-center mb-2 bg-gray-900 rounded p-2 group">
        <div className="text-gray-400 mr-2">
          <FaTerminal />
        </div>
        <select className="flex-grow bg-transparent border-none focus:outline-none text-gray-300">
            <option value="" disabled selected hidden>프랜차이즈 선택</option>
            {franchiseOptions.map((option,idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
        </select>
      </div>

      <div className="flex items-center mb-2 bg-gray-900 rounded p-2 group">
        <div className="text-gray-400 mr-2">
          <FaTerminal />
        </div>
        <select className="flex-grow bg-transparent border-none focus:outline-none text-gray-300">
            <option value="" disabled selected hidden>지점 선택</option>
            {storeOptions.map((option,idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
        </select>
      </div>

      <div className="flex justify-end">
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
