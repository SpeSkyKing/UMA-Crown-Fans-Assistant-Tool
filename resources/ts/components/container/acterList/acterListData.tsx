import React from 'react';
import {ActerListDataProps} from '../interface/prpps';
import {TdItem} from '../../common/tdItem';
export const ActerListData : React.FC<ActerListDataProps> = ({acter}) => {

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
            <TdItem content={acter.umamusume.umamusume_name}></TdItem>
            <TdItem content={acter.acter_name}></TdItem>
            <TdItem content={acter.nickname}></TdItem>
            <TdItem content={acterAge}></TdItem>
        </tr>
    );
};
