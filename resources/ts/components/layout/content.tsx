import React from 'react';
import { CharacterRegist } from '../container/characterRegist/characterRegist';
import { CharacterList } from '../container/characterList/characterList';
import { RaceList } from '../container/raceList/raceList';
import { RemainingRaceList } from '../container/remainingRaceList/remainingRaceList';
import { LiveList } from '../container/liveList/liveList';
import { ActerList } from '../container/acterList/acterList';
import { JewelController } from '../container/jewelController/jewelController';
import { ContentProps } from '../interface/props';

//コンテンツ情報
export const Content :React.FC<ContentProps> = ({ selectedContent, token}) => {
    switch(selectedContent){
        case 'characterRegist':
            return (
                <CharacterRegist token={token}></CharacterRegist>
            );
        case 'characterList':
            return (
                <CharacterList token={token}></CharacterList>
            );
        case 'raceList':
            return (
                <RaceList></RaceList>
            );
        case 'remainingRaceList':
            return (
                <RemainingRaceList token={token}></RemainingRaceList>
            );
        case 'liveList':
            return (
                <LiveList token={token}></LiveList>
            );
        case 'acterList':
            return (
                <ActerList></ActerList>
            );
        case 'jewelController':
            return (
                <JewelController token={token}></JewelController>
            );
    }
  };
