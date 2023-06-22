import React from 'react';

type AchievementType = {
    name: string,
    description: string,
    unlocked: boolean,
}

type Props = {
    achievement: AchievementType,
}

const Achievement: React.FC<Props> = ({ achievement }) => (
    <div className="achievement  p-4 my-2 rounded shadow-lg">
        <h2 className="text-xl mb-2">{achievement.name}</h2>
        <p className="mb-1">{achievement.description}</p>
        <p className={achievement.unlocked ? "text-green-500" : "text-red-500"}>
            {achievement.unlocked ? 'Unlocked' : 'Locked'}
        </p>
    </div>
);

export default Achievement;
