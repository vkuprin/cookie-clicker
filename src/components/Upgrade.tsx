import React from 'react';

type UpgradeType = {
    name: string,
    cost: number,
    effect: number,
}

type Props = {
    upgrade: UpgradeType,
    onBuy: () => void,
}

const Upgrade: React.FC<Props> = ({ upgrade, onBuy }) => (
    <div className="upgrade  p-4 my-10 rounded shadow-lg">
        <h2 className="text-xl mb-2">{upgrade.name}</h2>
        <p className="mb-1">Cost: {upgrade.cost} cookies</p>
        <p className="mb-2">Effect: Increases cookie production by {upgrade.effect}</p>
        <button onClick={onBuy} className="bg-orange-800 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
            Buy
        </button>
    </div>
);

export default Upgrade;
