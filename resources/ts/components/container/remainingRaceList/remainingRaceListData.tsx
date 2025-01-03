import React from 'react';
import {RemainingRaceListDataProps} from '../../interface/props';
export const RemainingRaceListData : React.FC<RemainingRaceListDataProps> = ({remainingRace,checkRaces}) => {
    const handleClick = () => {
        checkRaces(remainingRace.umamusume);
    };
    return (
        <tr>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
                {remainingRace.isAllCrown ? (
                    <span>全冠</span>
                ) : (
                    <button
                        onClick={handleClick}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        出走
                    </button>
                )}
            </td>

            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {remainingRace.umamusume.umamusume_name}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {remainingRace.isAllCrown ? '全冠':remainingRace.allCrownRace}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {remainingRace.turfSprintRace}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {remainingRace.turfMileRace}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {remainingRace.turfClassicRace}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {remainingRace.turfLongDistanceRace}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {remainingRace.dirtSprintDistanceRace}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {remainingRace.dirtMileRace}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {remainingRace.dirtClassicRace}
            </td>
        </tr>
    );
};
