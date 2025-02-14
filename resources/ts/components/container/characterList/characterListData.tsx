import { CharacterListDataProps } from '../../interface/props';
import { TdItem } from '../../common/tdItem';

//ウマ娘情報表示画面のレコード情報を定義する
export const CharacterListData : React.FC<CharacterListDataProps> = ({registUmamusume,returnFanUp}) => {

    //親画面へファン数変更ボタン処理を通知する
    const fanUp = () =>{
        returnFanUp(registUmamusume);
    }

    return (
        <tr>
            <TdItem content=
            {registUmamusume.umamusume.umamusume_name}
            />
            <TdItem content=
            {registUmamusume.umamusume.turf_aptitude.toString()}
            />
            <TdItem content=
            {registUmamusume.umamusume.dirt_aptitude.toString()}
            />
            <TdItem content=
            {registUmamusume.umamusume.sprint_aptitude.toString()}
            />
            <TdItem content=
            {registUmamusume.umamusume.mile_aptitude.toString()}
            />
            <TdItem content=
            {registUmamusume.umamusume.classic_aptitude.toString()}
            />
            <TdItem content=
            {registUmamusume.umamusume.long_distance_aptitude.toString()}
            />
            <TdItem content=
            {registUmamusume.umamusume.front_runner_aptitude.toString()}
            />
            <TdItem content=
            {registUmamusume.umamusume.early_foot_aptitude.toString()}
            />
            <TdItem content=
            {registUmamusume.umamusume.midfield_aptitude.toString()}
            />
            <TdItem content=
            {registUmamusume.umamusume.closer_aptitude.toString()}
            />
            <TdItem content=
            {registUmamusume.fans >= 100000000 ? '名手' : 'なし'}
            />
            <TdItem content=
            {registUmamusume.fans.toString()+"人"}
            />
            <td
            className="border border-gray-500 px-4 py-2 text-center text-black font-semibold cursor-pointer 
                        bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 
                        hover:from-pink-500 hover:to-blue-500 rounded-full 
                        transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={fanUp}
            >
            変動
            </td>
        </tr>
    );
};
