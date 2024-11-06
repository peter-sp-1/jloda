import React from "react";
import { Link } from "react-router-dom";


const CONBTN: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
        <div className="max-w-7xl mx-auto">
          <div className="relative group cursor-pointer">
            <div
              className="absolute -inset-1 bg-gradient-to-r from-red-600 to-violet-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"
            />
            <div className="relative px-7 py-4 bg-white ring-1 ring-gray-900/5 rounded-lg leading-none flex items-center justify-center">
              <Link to="/download" className="text-slate-800 font-bold">CONNECT</Link>
              {/* <p className="text-slate-800 font-bold">CONNECT</p> */}
            </div>
          </div>
        </div>
      </div>
  );
};

export default CONBTN;
