"use client";

import React from "react";
import { ChevronsUp, Info } from "lucide-react";

type BuildingType = {
  type: string;
  cost: number;
  baseCost: number;
  count: number;
  cps: number;
  baseCps: number;
  multiplier: number;
  description: string;
};

type Props = {
  building: BuildingType;
  onBuy: () => void;
  affordable: boolean;
};

const Building: React.FC<Props> = ({ building, onBuy, affordable }) => {
  const totalCps = building.cps * building.count * building.multiplier;

  return (
    <div className="building bg-white p-4 my-2 rounded-lg shadow-lg border border-orange-200 hover:border-orange-300 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-orange-900">
              {building.type}
            </h2>
            {building.multiplier > 1 && (
              <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                <ChevronsUp className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-600">
                  x{building.multiplier.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          <div className="mt-1 flex items-center gap-2">
            <p className="text-sm text-gray-600">{building.description}</p>
            <div className="group relative">
              <Info className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="hidden group-hover:block absolute left-full ml-2 p-2 bg-black text-white text-xs rounded w-48 z-10">
                Base CPS: {building.baseCps}
                <br />
                Current CPS: {building.cps.toFixed(1)}
                <br />
                Multiplier: x{building.multiplier.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Owned: {building.count}</span>
          <span className="text-green-600">
            Producing: {totalCps.toFixed(1)} CPS
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onBuy}
            disabled={!affordable}
            className={`flex-grow py-2 px-4 rounded font-semibold transition-colors ${
              affordable
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Buy for {building.cost.toLocaleString()} cookies
          </button>

          {building.count > 0 && (
            <div className="text-xs text-gray-500">
              Next:{" "}
              {(building.baseCost * Math.pow(1.15, building.count)).toFixed(0)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Building;
