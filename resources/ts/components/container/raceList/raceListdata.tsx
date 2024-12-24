import React from 'react';
import {Race} from '../../interface/DBinterface';
export const RaceListdata : React.FC<{ race: Race }> = ({race}) => {
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
        case 4:
            raceRank  = "PRE";
        break;
        case 5:
            raceRank  = "OP";
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
            {race.num_fans}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {Math.ceil(race.num_fans * 1.09)}
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
