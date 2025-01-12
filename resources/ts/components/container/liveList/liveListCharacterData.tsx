import React from 'react';
import {LiveListCharacterDataProps} from '../../interface/props';
import {TdItem} from '../../common/tdItem';
export const LiveListCharacterData : React.FC<LiveListCharacterDataProps> = ({umamusume}) => {
    return (
        <tr>
            <TdItem content=
                {umamusume.umamusume_name}
            />
        </tr>
    );
};
