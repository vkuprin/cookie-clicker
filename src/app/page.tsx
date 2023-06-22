import React from 'react';
import Game from '../components/Game';

const Home: React.FC = () => (
    <div className="flex flex-col justify-center items-center w-1/2 h-screen m-auto text-center">
        <Game />
    </div>
);

export default Home;
