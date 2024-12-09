import React from "react";

type BuildingType = {
  type: string;
  cost: number;
  count: number;
};

type Props = {
  building: BuildingType;
  onBuy: () => void;
};

const Building: React.FC<Props> = ({ building, onBuy }) => (
  <div className="building  p-4 my-2 rounded shadow-lg">
    <h2 className="text-xl mb-2">{building.type}</h2>
    <p className="mb-1">Cost: {building.cost} cookies</p>
    <p className="mb-2">Owned: {building.count}</p>
    <button
      onClick={onBuy}
      className="bg-orange-800 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
    >
      Buy
    </button>
  </div>
);

export default Building;
