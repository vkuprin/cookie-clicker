'use client';
import { useState } from 'react';
import Cookie from './Cookie';
import Building from './Building';
import Upgrade from './Upgrade';
import Achievement from './Achievement';

type BuildingType = {
    type: string,
    cost: number,
    count: number,
}

type UpgradeType = {
    name: string,
    cost: number,
    effect: number,
}

type AchievementType = {
    name: string,
    description: string,
    unlocked: boolean,
}

const Game = () => {
    const [cookies, setCookies] = useState<number>(0);
    const [buildings, setBuildings] = useState<BuildingType[]>([
        { type: 'Cursor', cost: 15, count: 0 },
        // Add more buildings here...
    ]);
    const [upgrades, setUpgrades] = useState<UpgradeType[]>([
        { name: 'Reinforced index finger', cost: 100, effect: 2 },
        // Add more upgrades here...
    ]);
    const [achievements, setAchievements] = useState<AchievementType[]>([
        { name: 'Wake and bake', description: 'Bake 1 cookie in one ascension.', unlocked: false },
        // Add more achievements here...
    ]);

    const handleClick = () => {
        setCookies(cookies + 1);
    };

    return (
        <div className="game p-4">
            <h1 className="text-2xl mb-4">Cookies: {cookies}</h1>
            <Cookie onClick={handleClick} />
            {buildings.map((building, i) => (
                <Building
                    key={i}
                    building={building}
                    onBuy={() => {
                        if (cookies >= building.cost) {
                            setCookies(cookies - building.cost);
                            setBuildings(prevBuildings => {
                                const newBuildings = [...prevBuildings];
                                newBuildings[i].count++;
                                return newBuildings;
                            });
                        }
                    }}
                />
            ))}
            {upgrades.map((upgrade, i) => (
                <Upgrade
                    key={i}
                    upgrade={upgrade}
                    onBuy={() => {
                        if (cookies >= upgrade.cost) {
                            setCookies(cookies - upgrade.cost);
                            setUpgrades(prevUpgrades => {
                                const newUpgrades = [...prevUpgrades];
                                newUpgrades[i].effect++;
                                return newUpgrades;
                            });
                        }
                    }}
                />
            ))}
            {achievements.map((achievement, i) => (
                <Achievement key={i} achievement={achievement} />
            ))}
        </div>
    );
};

export default Game;
