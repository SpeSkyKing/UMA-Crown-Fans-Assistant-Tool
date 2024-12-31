import React from 'react';
import {Race} from '../interface/interface';
type RemainingRaceListItemProps = {
    race: Race;
    runRace: (race_id: number) => void;
  };
export const RemainingRaceListItem : React.FC<RemainingRaceListItemProps> = ({race,runRace}) => {
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
    const handleClick = () => {
      runRace(race.race_id);
    };
    return (
      <tr key={race.race_id} className="border-t">
      <td className="px-4 py-2 text-center">{race.race_name}</td>
      <td className="px-4 py-2 text-center">{race.race_state ? 'ダート' : '芝'}</td>
      <td className="px-4 py-2 text-center">{raceDistance}</td>
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
