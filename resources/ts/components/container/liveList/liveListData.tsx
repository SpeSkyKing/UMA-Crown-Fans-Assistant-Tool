import React from 'react';
import {LiveListDataProps} from '../../interface/props';
export const LiveListData : React.FC<LiveListDataProps> = ({live,onClick}) => {

    const handleClick = () =>{
        onClick(live);
    }
    return (
        <tr>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold" onClick={handleClick}>
            {live.live_name}
            </td>
        </tr>
    );
};
