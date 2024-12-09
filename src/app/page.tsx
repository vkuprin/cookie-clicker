import React from "react";
import Game from "../components/Game";

const Home: React.FC = () => (
  <div className="p-10 flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white">
    <div className="bg-white text-black p-8 rounded-lg shadow-md w-11/12 sm:w-3/4 lg:w-1/2">
      <Game />
    </div>
  </div>
);

export default Home;
