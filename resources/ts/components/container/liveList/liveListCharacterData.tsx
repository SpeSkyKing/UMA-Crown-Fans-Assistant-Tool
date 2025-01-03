import React from 'react';
import {LiveListCharacterDataProps} from '../../interface/props';
export const LiveListCharacterData : React.FC<LiveListCharacterDataProps> = ({umamusume}) => {
    return (
        <tr>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {umamusume.umamusume_name}
            </td>
        </tr>
    );
};
