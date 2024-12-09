"use client";
import {useState, useEffect, useCallback} from "react";
import Cookie from "./Cookie";
import Building from "./Building";
import Upgrade from "./Upgrade";
import Achievement from "./Achievement";

type BuildingType = {
  type: string;
  cost: number;
  count: number;
  cps: number;
};

type UpgradeType = {
  name: string;
  cost: number;
  effect: number;
  target: string;
};

type AchievementType = {
  name: string;
  description: string;
  condition: () => boolean;
  unlocked?: boolean;
};

const Game = () => {
  const [cookies, setCookies] = useState<number>(0);
  const [clickPower, setClickPower] = useState<number>(1);

  const [buildings, setBuildings] = useState<BuildingType[]>([
    { type: "Cursor", cost: 15, count: 0, cps: 0.1 },
    { type: "Grandma", cost: 100, count: 0, cps: 1 },
    { type: "Farm", cost: 500, count: 0, cps: 8 },
  ]);

  const [upgrades, setUpgrades] = useState<UpgradeType[]>([
    { name: "Reinforced index finger", cost: 100, effect: 2, target: "click" },
    { name: "Steel-plated rolling pins", cost: 500, effect: 2, target: "Grandma" },
    { name: "Fertilizer", cost: 2500, effect: 2, target: "Farm" },
  ]);

  const [achievements, setAchievements] = useState<(AchievementType & { unlocked: boolean })[]>([
    {
      name: "Wake and bake",
      description: "Bake 1 cookie in one ascension.",
      condition: () => cookies >= 1,
      unlocked: false
    },
  ]);

  const handleClick = () => {
    setCookies(cookies + clickPower);
  };

  const handleBuyBuilding = (building: BuildingType, index: number) => {
    if (cookies >= building.cost) {
      setCookies(cookies - building.cost);
      setBuildings((prevBuildings) => {
        const newBuildings = [...prevBuildings];
        newBuildings[index].count++;
        return newBuildings;
      });
    }
  };

  const handleBuyUpgrade = (upgrade: UpgradeType, index: number) => {
    if (cookies >= upgrade.cost) {
      setCookies(cookies - upgrade.cost);

      setUpgrades((prevUpgrades) => {
        const newUpgrades = [...prevUpgrades];
        newUpgrades[index].cost *= 2;
        return newUpgrades;
      });

      if (upgrade.target === "click") {
        setClickPower((clickPower) => clickPower * upgrade.effect);
      } else {
        setBuildings((buildings) =>
            buildings.map((b) => {
              if (b.type === upgrade.target) {
                return { ...b, cps: b.cps * upgrade.effect };
              }
              return b;
            }),
        );
      }
    }
  };

  useEffect(() => {
    setAchievements((prevAchievements) =>
        prevAchievements.map((achievement) => {
          if (achievement.unlocked) return achievement;
          return {
            ...achievement,
            unlocked: achievement.condition()
          };
        })
    );
  }, [cookies]);

  const calculateCookiesPerSecond = useCallback(() => {
    let totalCPS = 0;
    buildings.forEach((building) => {
      totalCPS += building.cps * building.count;
    });
    return totalCPS;
  }, [buildings]);

  const incrementCookiesPerSecond = useCallback(() => {
    setCookies((cookies) => cookies + calculateCookiesPerSecond());
  }, [calculateCookiesPerSecond]);

  useEffect(() => {
    const timerID = setInterval(incrementCookiesPerSecond, 1000);
    return () => clearInterval(timerID);
  }, [incrementCookiesPerSecond]);

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
        {achievements.map((achievement) => (
            <Achievement
                key={achievement.name}
                achievement={{
                  name: achievement.name,
                  description: achievement.description,
                  unlocked: achievement.unlocked
                }}
            />
        ))}
      </div>
  );
};

export default Game;
