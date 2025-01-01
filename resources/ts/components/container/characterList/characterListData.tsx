import {CharacterListDataProps} from '../../interface/props';
export const CharacterListData : React.FC<CharacterListDataProps> = ({registUmamusume}) => {
    return (
        <tr>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {registUmamusume.umamusume.umamusume_name}
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
        </tr>
    );
};
