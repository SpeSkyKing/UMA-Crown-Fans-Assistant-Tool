import {CharacterListDataProps} from '../../interface/props';
export const CharacterListData : React.FC<CharacterListDataProps> = ({registUmamusume,returnFanUp}) => {

    const fanUp = () =>{
        returnFanUp(registUmamusume);
    }
    return (
        <tr>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {registUmamusume.umamusume.umamusume_name}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {registUmamusume.fans >= 100000000 ? '名手' : 'なし'}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {registUmamusume.fans}人
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {registUmamusume.umamusume.turf_aptitude}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {registUmamusume.umamusume.dirt_aptitude}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {registUmamusume.umamusume.sprint_aptitude}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {registUmamusume.umamusume.mile_aptitude}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {registUmamusume.umamusume.classic_aptitude}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {registUmamusume.umamusume.long_distance_aptitude}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {registUmamusume.umamusume.front_runner_aptitude}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {registUmamusume.umamusume.early_foot_aptitude}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {registUmamusume.umamusume.midfield_aptitude}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {registUmamusume.umamusume.closer_aptitude}
            </td>
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
