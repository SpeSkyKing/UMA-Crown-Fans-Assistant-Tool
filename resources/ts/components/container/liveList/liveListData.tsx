import React from 'react';
import {Live} from '../interface/interface';
export const LiveListData : React.FC<{ live: Live }> = ({live}) => {
    return (
        <tr>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {live.live_name}
            </td>
        </tr>
    );
};
