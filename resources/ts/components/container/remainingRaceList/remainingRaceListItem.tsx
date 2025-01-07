import React from 'react';
import {RemainingRaceListItemProps} from '../../interface/props';
export const RemainingRaceListItem : React.FC<RemainingRaceListItemProps> = ({race,runRace}) => {
    let raceDistance = "";
    let distanceBgColorClass = "";
    switch (Number(race.distance)) {
        case 1:
            raceDistance = "短距離";
            distanceBgColorClass = "bg-pink-300"; 
        break;
        case 2:
            raceDistance = "マイル";
            distanceBgColorClass = "bg-green-500"; 
        break;
        case 3:
            raceDistance = "中距離";
            distanceBgColorClass = "bg-yellow-300"; 
        break;
        case 4:
            raceDistance = "長距離";
            distanceBgColorClass = "bg-blue-500"; 
        break;
        default:
        break;
    }

    let raceCount = 0;
    if(race.junior_flag){
        raceCount++;
    }
    if(race.classic_flag){
        raceCount++;
    }
    if(race.senior_flag){
        raceCount++;
    }

    let raceState = "";
    let stateBgColorClass = "";
    if(race.race_state){
        raceState = 'ダート';
        stateBgColorClass = "bg-amber-800";
    }else{
        raceState = '芝';
        stateBgColorClass = "bg-lime-400";
    }
    const handleClick = () => {
      runRace(race.race_id);
    };
    return (
      <tr key={race.race_id} className="border-t">
      <td className="px-4 py-2 text-center">{race.race_name}</td>
      <td className={`px-4 py-2 text-center  ${stateBgColorClass}`}>{raceState}</td>
      <td className={`px-4 py-2 text-center  ${distanceBgColorClass}`}>{raceDistance}</td>
      <td className="px-4 py-2 text-center">{raceCount > 1 ? "〇":"✕" }</td>
      <td className="px-4 py-2 text-center">
          <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleClick()}
          >
              出走
          </button>
      </td>
    </tr>
    );
};
