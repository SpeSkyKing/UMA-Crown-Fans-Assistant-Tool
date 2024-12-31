import React from 'react';
import {CharacterRegist} from '../container/characterRegist/characterRegist';
import {CharacterList} from '../container/characterList/characterList';
import {RaceList} from '../container/raceList/raceList';
import {RemainingRaceList} from '../container/remainingRaceList/remainingRaceList';
import {LiveList} from '../container/liveList/liveList';
import {ActerList} from '../container/acterList/acterList';

export const Content = ({ selectedContent }) => {
    switch(selectedContent){
        case 'characterRegist':
            return (
                <CharacterRegist></CharacterRegist>
            );
        case 'characterList':
            return (
                <CharacterList></CharacterList>
            );
        case 'raceList':
            return (
                <RaceList></RaceList>
            );
        case 'remainingRaceList':
            return (
                <RemainingRaceList></RemainingRaceList>
            );
        case 'liveList':
            return (
                <LiveList></LiveList>
            );
        case 'acterList':
            return (
                <ActerList></ActerList>
            );
    }
  };
