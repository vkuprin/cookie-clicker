'use client';
import { useState, useEffect } from 'react';
import Cookie from './Cookie';
import Building from './Building';
import Upgrade from './Upgrade';
import Achievement from './Achievement';

type BuildingType = {
    type: string,
    cost: number,
    count: number,
    cps: number, // cookies per second
}

type UpgradeType = {
    name: string,
    cost: number,
    effect: number,
    target: string, // can be 'click' or building type
}

type AchievementType = {
    name: string,
    description: string,
    condition: () => boolean, // a function to check if achievement is unlocked
}

const Game = () => {
    const [cookies, setCookies] = useState<number>(0);
    const [clickPower, setClickPower] = useState<number>(1);

    const [buildings, setBuildings] = useState<BuildingType[]>([
        { type: 'Cursor', cost: 15, count: 0, cps: 0.1 },
        { type: 'Grandma', cost: 100, count: 0, cps: 1 },
        { type: 'Farm', cost: 500, count: 0, cps: 8 },
    ]);

    const [upgrades, setUpgrades] = useState<UpgradeType[]>([
        { name: 'Reinforced index finger', cost: 100, effect: 2, target: 'click' },
        { name: 'Steel-plated rolling pins', cost: 500, effect: 2, target: 'Grandma' },
        { name: 'Fertilizer', cost: 2500, effect: 2, target: 'Farm' },
    ]);

    const [achievements, setAchievements] = useState<AchievementType[]>([
        {
            name: 'Wake and bake',
            description: 'Bake 1 cookie in one ascension.',
            condition: () => cookies >= 1,
        },
    ]);

    const handleClick = () => {
        setCookies(cookies + clickPower);
    };

    const handleBuyBuilding = (building: BuildingType, index: number) => {
        if (cookies >= building.cost) {
            setCookies(cookies - building.cost);
            setBuildings(prevBuildings => {
                const newBuildings = [...prevBuildings];
                newBuildings[index].count++;
                return newBuildings;
            });
        }
    }

    const handleBuyUpgrade = (upgrade: UpgradeType, index: number) => {
        if (cookies >= upgrade.cost) {
            setCookies(cookies - upgrade.cost);

            setUpgrades(prevUpgrades => {
                const newUpgrades = [...prevUpgrades];
                newUpgrades[index].cost *= 2;
                return newUpgrades;
            });

            if (upgrade.target === 'click') {
                setClickPower(clickPower => clickPower * upgrade.effect);
            } else {
                setBuildings(buildings => buildings.map(b => {
                    if (b.type === upgrade.target) {
                        return { ...b, cps: b.cps * upgrade.effect };
                    }
                    return b;
                }));
            }
        }
    }

    useEffect(() => {
        setAchievements(achievements.map(a => {
            if (!a.condition()) return a;
            return { ...a, condition: () => true }; // mark as unlocked
        }));
    }, [cookies]);


    const calculateCookiesPerSecond = () => {
        let totalCPS = 0;
        buildings.forEach((building) => {
            totalCPS += building.cps * building.count;
        });
        return totalCPS;
    };

    const incrementCookiesPerSecond = () => {
        setCookies(cookies => cookies + calculateCookiesPerSecond());
    };

    useEffect(() => {
        const timerID = setInterval(incrementCookiesPerSecond, 1000)

        return () => {
            clearInterval(timerID);
        }
    }, [buildings])

    return (
        <div className="game p-4">
            <h1 className="text-2xl mb-4">Cookies: {cookies.toFixed(1)}</h1>
            <Cookie onClick={handleClick} />
            {buildings.map((building, i) => (
                <Building
                    key={building.type}
                    building={building}
                    onBuy={() => handleBuyBuilding(building, i)}
                />
            ))}
            {upgrades.map((upgrade, i) => (
                <Upgrade
                    key={upgrade.name}
                    upgrade={upgrade}
                    onBuy={() => handleBuyUpgrade(upgrade, i)}
                />
            ))}
            {achievements.map((achievement, i) => (
                <Achievement
                    key={achievement.name}
                    achievement={{
                        name: achievement.name,
                        description: achievement.description,
                        unlocked: achievement.condition(),
                    }}
                />
            ))}
        </div>
    );
};

export default Game;
