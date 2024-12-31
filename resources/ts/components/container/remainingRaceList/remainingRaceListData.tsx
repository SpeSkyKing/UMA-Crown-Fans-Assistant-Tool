import React from 'react';
import {RemainingRaces} from '../interface/interface';
export const RemainingRaceListData : React.FC<{ remainingRaces: RemainingRaces }> = ({remainingRaces}) => {
    return (
        <tr>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {remainingRaces.umamusume.umamusume_name}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {remainingRaces.isAllCrown ? '全冠':remainingRaces.allCrownRace}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {remainingRaces.turfSprintRace}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {remainingRaces.turfMileRace}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {remainingRaces.turfClassicRace}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {remainingRaces.turfLongDistanceRace}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {remainingRaces.dirtMileRace}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {remainingRaces.dirtClassicRace}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {remainingRaces.dirtLongDistanceRace}
            </td>
        </tr>
    );
};
