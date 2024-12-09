"use client";

import { useState, useEffect, useCallback } from "react";
import Cookie from "./Cookie";
import Building from "./Building";
import Upgrade from "./Upgrade";
import Achievement from "./Achievement";

type BuildingType = {
  type: string;
  cost: number;
  baseCost: number;
  count: number;
  cps: number;
  baseCps: number;
  description: string;
  multiplier: number;
};

type UpgradeType = {
  name: string;
  cost: number;
  effect: number;
  target: string;
  description: string;
  purchased: boolean;
  requirement?: {
    building?: string;
    count?: number;
    cookies?: number;
  };
};

type AchievementType = {
  name: string;
  description: string;
  condition: () => boolean;
  unlocked: boolean;
  icon?: string;
  reward?: {
    type: string;
    value: number;
  };
};

type GameStats = {
  totalCookiesBaked: number;
  totalClicks: number;
  buildingsPurchased: number;
  upgradesPurchased: number;
};

const Game = () => {
  const [cookies, setCookies] = useState<number>(0);
  const [clickPower, setClickPower] = useState<number>(1);
  const [globalMultiplier, setGlobalMultiplier] = useState<number>(1);
  const [stats, setStats] = useState<GameStats>({
    totalCookiesBaked: 0,
    totalClicks: 0,
    buildingsPurchased: 0,
    upgradesPurchased: 0,
  });

  const [buildings, setBuildings] = useState<BuildingType[]>([
    {
      type: "Cursor",
      cost: 15,
      baseCost: 15,
      count: 0,
      cps: 0.1,
      baseCps: 0.1,
      multiplier: 1,
      description: "Autoclicks once every 10 seconds.",
    },
    {
      type: "Grandma",
      cost: 100,
      baseCost: 100,
      count: 0,
      cps: 1,
      baseCps: 1,
      multiplier: 1,
      description: "A nice grandma to bake more cookies.",
    },
    {
      type: "Farm",
      cost: 500,
      baseCost: 500,
      count: 0,
      cps: 8,
      baseCps: 8,
      multiplier: 1,
      description: "Grows cookie plants from cookie seeds.",
    },
    {
      type: "Mine",
      cost: 2000,
      baseCost: 2000,
      count: 0,
      cps: 47,
      baseCps: 47,
      multiplier: 1,
      description: "Mines out cookie dough and chocolate chips.",
    },
    {
      type: "Factory",
      cost: 10000,
      baseCost: 10000,
      count: 0,
      cps: 260,
      baseCps: 260,
      multiplier: 1,
      description: "Mass produces cookies.",
    },
  ]);

  const [upgrades, setUpgrades] = useState<UpgradeType[]>([
    {
      name: "Reinforced Index Finger",
      cost: 100,
      effect: 2,
      target: "click",
      description: "Doubles clicking power.",
      purchased: false,
      requirement: { cookies: 100 },
    },
    {
      name: "Steel-plated Rolling Pins",
      cost: 500,
      effect: 2,
      target: "Grandma",
      description: "Grandmas are twice as efficient.",
      purchased: false,
      requirement: { building: "Grandma", count: 5 },
    },
    {
      name: "Fertilizer",
      cost: 2500,
      effect: 2,
      target: "Farm",
      description: "Farms are twice as efficient.",
      purchased: false,
      requirement: { building: "Farm", count: 5 },
    },
    {
      name: "Cookie Global Multiplier",
      cost: 5000,
      effect: 1.5,
      target: "global",
      description: "All production multiplied by 1.5",
      purchased: false,
      requirement: { cookies: 5000 },
    },
  ]);

  const [achievements, setAchievements] = useState<AchievementType[]>([
    {
      name: "Wake and Bake",
      description: "Bake 1 cookie.",
      condition: () => stats.totalCookiesBaked >= 1,
      unlocked: false,
      reward: { type: "multiplier", value: 1.1 },
    },
    {
      name: "Cookie Monster",
      description: "Bake 1,000 cookies.",
      condition: () => stats.totalCookiesBaked >= 1000,
      unlocked: false,
      reward: { type: "multiplier", value: 1.2 },
    },
    {
      name: "Clicking Frenzy",
      description: "Click 100 times.",
      condition: () => stats.totalClicks >= 100,
      unlocked: false,
      reward: { type: "clickPower", value: 1.5 },
    },
  ]);

  const calculateBuildingCost = useCallback((building: BuildingType) => {
    return Math.ceil(building.baseCost * Math.pow(1.15, building.count));
  }, []);

  const handleClick = () => {
    const cookiesGained = clickPower * globalMultiplier;
    setCookies((prev) => prev + cookiesGained);
    setStats((prev) => ({
      ...prev,
      totalCookiesBaked: prev.totalCookiesBaked + cookiesGained,
      totalClicks: prev.totalClicks + 1,
    }));
  };

  const handleBuyBuilding = (building: BuildingType, index: number) => {
    if (cookies >= building.cost) {
      setCookies(cookies - building.cost);
      setBuildings((prevBuildings) => {
        const newBuildings = [...prevBuildings];
        newBuildings[index] = {
          ...building,
          count: building.count + 1,
          cost: calculateBuildingCost({
            ...building,
            count: building.count + 1,
          }),
        };
        return newBuildings;
      });
      setStats((prev) => ({
        ...prev,
        buildingsPurchased: prev.buildingsPurchased + 1,
      }));
    }
  };

  const handleBuyUpgrade = (upgrade: UpgradeType, index: number) => {
    if (cookies >= upgrade.cost && !upgrade.purchased) {
      setCookies(cookies - upgrade.cost);
      setUpgrades((prev) => {
        const newUpgrades = [...prev];
        newUpgrades[index] = { ...upgrade, purchased: true };
        return newUpgrades;
      });

      if (upgrade.target === "click") {
        setClickPower((prev) => prev * upgrade.effect);
      } else if (upgrade.target === "global") {
        setGlobalMultiplier((prev) => prev * upgrade.effect);
      } else {
        setBuildings((prev) =>
          prev.map((building) =>
            building.type === upgrade.target
              ? {
                  ...building,
                  multiplier: building.multiplier * upgrade.effect,
                  cps:
                    building.baseCps * (building.multiplier * upgrade.effect),
                }
              : building,
          ),
        );
      }

      setStats((prev) => ({
        ...prev,
        upgradesPurchased: prev.upgradesPurchased + 1,
      }));
    }
  };

  const calculateCookiesPerSecond = useCallback(() => {
    return (
      buildings.reduce(
        (total, building) =>
          total + building.cps * building.count * building.multiplier,
        0,
      ) * globalMultiplier
    );
  }, [buildings, globalMultiplier]);

  useEffect(() => {
    const timerID = setInterval(() => {
      const cps = calculateCookiesPerSecond();
      setCookies((prev) => prev + cps);
      setStats((prev) => ({
        ...prev,
        totalCookiesBaked: prev.totalCookiesBaked + cps,
      }));
    }, 1000);
    return () => clearInterval(timerID);
  }, [calculateCookiesPerSecond]);

  useEffect(() => {
    setAchievements((prev) =>
      prev.map((achievement) => {
        if (!achievement.unlocked && achievement.condition()) {
          if (achievement.reward) {
            if (achievement.reward.type === "multiplier") {
              setGlobalMultiplier((prev) => prev * achievement.reward!.value);
            } else if (achievement.reward.type === "clickPower") {
              setClickPower((prev) => prev * achievement.reward!.value);
            }
          }
          return { ...achievement, unlocked: true };
        }
        return achievement;
      }),
    );
  }, [stats]);

  const availableUpgrades = upgrades.filter((upgrade) => {
    if (upgrade.purchased) return false;
    if (upgrade.requirement) {
      if (upgrade.requirement.cookies && cookies < upgrade.requirement.cookies)
        return false;
      if (upgrade.requirement.building && upgrade.requirement.count) {
        const building = buildings.find(
          (b) => b.type === upgrade.requirement!.building,
        );
        if (!building || building.count < upgrade.requirement.count)
          return false;
      }
    }
    return true;
  });

  return (
    <div className="game flex flex-col gap-4 p-4 max-w-4xl mx-auto">
      <div className="stats bg-gray-100 p-4 rounded-lg">
        <h1 className="text-3xl font-bold">Cookies: {cookies.toFixed(1)}</h1>
        <p className="text-lg">
          per second: {calculateCookiesPerSecond().toFixed(1)}
        </p>
        <p>Total baked: {stats.totalCookiesBaked.toFixed(0)}</p>
      </div>

      <Cookie onClick={handleClick} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="buildings">
          <h2 className="text-2xl font-bold mb-4">Buildings</h2>
          {buildings.map((building, i) => (
            <Building
              key={building.type}
              building={building}
              onBuy={() => handleBuyBuilding(building, i)}
              affordable={cookies >= building.cost}
            />
          ))}
        </div>

        <div className="upgrades">
          <h2 className="text-2xl font-bold mb-4">Upgrades</h2>
          {availableUpgrades.map((upgrade, i) => (
            <Upgrade
              key={upgrade.name}
              upgrade={upgrade}
              onBuy={() => handleBuyUpgrade(upgrade, i)}
              affordable={cookies >= upgrade.cost}
            />
          ))}
        </div>
      </div>

      <div className="achievements">
        <h2 className="text-2xl font-bold mb-4">Achievements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <Achievement key={achievement.name} achievement={achievement} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Game;
