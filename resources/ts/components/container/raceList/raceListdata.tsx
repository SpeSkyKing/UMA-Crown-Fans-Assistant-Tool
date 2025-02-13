import React from 'react';
import {RaceListdataProps} from '../../interface/props';
import {TdItem} from '../../common/tdItem';
export const RaceListdata : React.FC<RaceListdataProps> = ({race}) => {
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
            <TdItem content=
            {race.race_name}
            />
            <TdItem content=
            {raceRank}
            />
            <TdItem content=
            {race.race_state ? "ダート" : "芝"}
            />
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold" style={{ fontSize: 'clamp(1rem, 1.5vw, 0.25rem)' , whiteSpace: 'nowrap'}}>
            {raceDistance}/{race.distance_detail}m
            </td>
            <TdItem content=
            {race.num_fans.toString()}
            />
            <TdItem content=
            {Math.ceil(race.num_fans * 1.09).toString()}
            />
            <TdItem content=
            {toRun}
            />
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold" style={{ fontSize: 'clamp(1rem, 1.5vw, 0.25rem)' , whiteSpace: 'nowrap'}}>
            {race.race_months}月{race.half_flag ? "後半" : "前半"}
            </td>
        </tr>
    );
};