import {useState } from 'react';
import {Race} from '../../interface/interface';
type CharacterRegistDataProps = {
    race: Race;
    checked: boolean;
    onCheckboxChange: (raceId: number,checked:boolean) => void;
  };
export const CharacterRegistData : React.FC<CharacterRegistDataProps> = ({race,checked,onCheckboxChange}) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        onCheckboxChange(race.race_id, isChecked); // 親に変更を通知
      };

    let raceDistance = "";
    switch (Number(race.distance)) {
        case 1:
            raceDistance = "短距離";
        break;
        case 2:
            raceDistance = "マイル";
        break;
        case 3:
            raceDistance = "中距離";
        break;
        case 4:
            raceDistance = "長距離";
        break;
    }

    let raceRank = "";
    switch(Number(race.race_rank)){
        case 1:
            raceRank = "GⅠ";
        break;
        case 2:
            raceRank = "GⅡ";
        break;
        case 3:
            raceRank = "GⅢ";
        break;
    }

    let toRun = "";
    if(race.junior_flag){
        toRun = "ジュニア"
    }

    if(race.classic_flag){
        toRun += toRun !="" ? "/" : ""; 
        toRun += "クラシック";
    }

    if(race.senior_flag){
        toRun += toRun !="" ? "/" : ""; 
        toRun += "シニア"
    }

    return (
        <tr>
            <td className="border border-gray-500 px-4 py-2 text-center">
            <input
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            />
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {race.race_name}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {raceRank}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {race.race_state ? "ダート" : "芝"}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {raceDistance}/{race.distance_detail}m
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {toRun}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {race.race_months}月{race.half_flag ? "後半" : "前半"}
            </td>
        </tr>
    );
};
