import React from 'react';
import {LiveListDataProps} from '../../interface/props';
export const LiveListData : React.FC<LiveListDataProps> = ({live}) => {
    return (
        <tr>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {live.live_name}
            </td>
        </tr>
    );
};
