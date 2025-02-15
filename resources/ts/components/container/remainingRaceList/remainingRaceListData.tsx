import React from 'react';
import { TdItem } from '../../common/tdItem';
import { RemainingRaceListDataProps } from '../../interface/props';

//声優情報表示画面のレコード情報を定義する
export const RemainingRaceListData: React.FC<RemainingRaceListDataProps> = ({ remainingRace , checkRaces }) => {

    //出走画面表示処理を親へ通知する
    const handleClick = () => {
        checkRaces(remainingRace.umamusume);
    };

    return (
        <tr>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold" style={{ fontSize: 'clamp(1rem, 1.5vw, 0.25rem)' , whiteSpace: 'nowrap'}}>
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
            <TdItem content=
            {remainingRace.umamusume.umamusume_name}
            />
            <TdItem content=
                    {remainingRace.isAllCrown ? '全冠' : remainingRace.allCrownRace.toString()}
            />
            <TdItem content=
                    {remainingRace.turfSprintRace.toString()}
            />
            <TdItem content=
                    {remainingRace.turfMileRace.toString()}
            />
            <TdItem content=
                    {remainingRace.turfClassicRace.toString()}
            />
            <TdItem content=
                    {remainingRace.turfLongDistanceRace.toString()}
            />
            <TdItem content=
                    {remainingRace.dirtSprintDistanceRace.toString()}
            />
            <TdItem content=
                    {remainingRace.dirtMileRace.toString()}
            />
            <TdItem content=
                    {remainingRace.dirtClassicRace.toString()}
            />
        </tr>
    );
};
