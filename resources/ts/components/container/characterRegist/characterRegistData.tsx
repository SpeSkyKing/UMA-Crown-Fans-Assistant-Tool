import { CharacterRegistDataProps } from '../../interface/props';
import { TdItem } from '../../common/tdItem';

//ウマ娘登録画面のレコード情報を定義する
export const CharacterRegistData : React.FC<CharacterRegistDataProps> = ({ race , checked , onCheckboxChange }) => {
    
    //選択したレコードに対してチェック処理を行う
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        onCheckboxChange(race.race_id, isChecked);
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
            <TdItem content=
            {race.race_name}
            />
            <TdItem content=
            {raceRank}
            />
            <TdItem content=
            {race.race_state ? "ダート" : "芝"}
            />
            <td className="border border-gray-500 px-4 py-2 text-center">
            {raceDistance}/{race.distance_detail}m
            </td>
            <TdItem content=
            {toRun}
            />
            <td className="border border-gray-500 px-4 py-2 text-center">
            {race.race_months}月{race.half_flag ? "後半" : "前半"}
            </td>
        </tr>
    );
};
