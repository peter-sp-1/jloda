import React from "react";
import CONBTN from "./connectBTN";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-black relative overflow-hidden">
      <h1 className="font-bold text-white mb-5">IT'S YOUR VIDEO! Watch it! Download it!</h1>

      <CONBTN />
      
      {/* Right-side gradient using the provided design */}
      <div className="relative h-full w-1/3 bg-slate-950">
        {/* Left circle */}
        <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]" />
        {/* Right circle */}
        <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]" />
      </div>
    </div>
  );
};

export default Home;
