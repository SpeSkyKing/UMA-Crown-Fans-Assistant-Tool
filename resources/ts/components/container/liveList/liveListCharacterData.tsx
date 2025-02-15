import React from 'react';
import { LiveListCharacterDataProps } from '../../interface/props';
import { TdItem } from '../../common/tdItem';

//声優情報表示画面のレコード情報を定義する
export const LiveListCharacterData : React.FC<LiveListCharacterDataProps> = ({ umamusume }) => {
    return (
        <tr>
            <TdItem content=
                {umamusume.umamusume_name}
            />
        </tr>
    );
};
