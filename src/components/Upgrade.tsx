"use client";

import React from "react";
import { Zap, Lock, Target } from "lucide-react";

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

type Props = {
  upgrade: UpgradeType;
  onBuy: () => void;
  affordable: boolean;
};

const Upgrade: React.FC<Props> = ({ upgrade, onBuy, affordable }) => {
  const getEffectDescription = () => {
    if (upgrade.target === "click") {
      return `Clicking power x${upgrade.effect}`;
    } else if (upgrade.target === "global") {
      return `All production x${upgrade.effect}`;
    } else {
      return `${upgrade.target} production x${upgrade.effect}`;
    }
  };

  const getRequirementText = () => {
    if (!upgrade.requirement) return null;

    const parts = [];
    if (upgrade.requirement.cookies) {
      parts.push(
        `${upgrade.requirement.cookies.toLocaleString()} total cookies`,
      );
    }
    if (upgrade.requirement.building && upgrade.requirement.count) {
      parts.push(
        `${upgrade.requirement.count} ${upgrade.requirement.building}s`,
      );
    }
    return parts.join(" and ");
  };

  return (
    <div
      className={`upgrade p-4 my-2 rounded-lg shadow-lg border transition-all ${
        upgrade.purchased
          ? "bg-gray-50 border-gray-200"
          : "bg-white border-orange-200 hover:border-orange-300"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {upgrade.target === "click" ? (
            <Zap className="w-8 h-8 text-yellow-500" />
          ) : upgrade.target === "global" ? (
            <Target className="w-8 h-8 text-blue-500" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-orange-600 text-xs font-bold">
                {upgrade.target.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">{upgrade.name}</h2>
            {upgrade.purchased && (
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                Purchased
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 mt-1">{upgrade.description}</p>

          <div className="mt-2 flex flex-wrap gap-2">
            <span className="text-sm font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              {getEffectDescription()}
            </span>

            {getRequirementText() && !upgrade.purchased && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Lock className="w-4 h-4" />
                <span>Requires {getRequirementText()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {!upgrade.purchased && (
        <div className="mt-3">
          <button
            onClick={onBuy}
            disabled={!affordable}
            className={`w-full py-2 px-4 rounded font-semibold transition-colors ${
              affordable
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Buy for {upgrade.cost.toLocaleString()} cookies
          </button>
        </div>
      )}
    </div>
  );
};

export default Upgrade;
