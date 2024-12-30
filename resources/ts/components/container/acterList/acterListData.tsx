import React from 'react';
import {Acter} from '../../interface/interface';
export const ActerListData : React.FC<{ acter: Acter }> = ({acter}) => {

    function calculateAge(birthDate: Date): string {
        if (typeof birthDate === 'string') {
            birthDate = new Date(birthDate);
        }
        
        if(birthDate.getFullYear() == 9999) return '不明';

        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
    
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
    
        return age + '歳';
    }

    const acterAge = calculateAge(acter.birthday);
    
    return (
        <tr>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {acter.umamusume.umamusume_name}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {acter.acter_name}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {acter.nickname}
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center text-black font-semibold">
            {acterAge}
            </td>
        </tr>
    );
};
