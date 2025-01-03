import {Umamusume,Race,Live,Acter,RemainingRace,RegistUmamusume} from './interface';

export interface HeaderProps{
    ItemArray: Item[];
}

export interface Item {
    display: string;
}

export interface  AuthProps {
    onLogin: () => void;
}

export interface PasswordForgetProps {
    onReturn: () => void;
}

export interface RegistProps {
    onReturn: () => void;
    onRegist: (Username: string, password: string) => void;
}

export interface InputFieldProps {
    id: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'tel' | 'date' | 'file';
    value: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    accept?: string;
}

export interface ActerListDataProps {
    acter: Acter;
}

export interface CharacterListDataProps {
    registUmamusume: RegistUmamusume;
}

export interface AptitudeProps {
    name: string;
    aptitude: string;
}

export interface CharacterRegistDataProps {
    race: Race;
    checked: boolean;
    onCheckboxChange: (raceId: number,checked:boolean) => void;
}

export interface LiveListDataProps {
    live: Live;
    onClick: (live : Live) => void;
}

export interface LiveListCharacterDataProps{
    umamusume: Umamusume;
}

export interface RaceListdataProps {
    race: Race;
}

export interface RemainingRaceListDataProps {
    remainingRace: RemainingRace;
    checkRaces: (umamusume: Umamusume) => void;   
}

export interface RemainingRaceListItemProps {
    race: Race;
    runRace: (race_id: number) => void;
}

export interface RemainingRaceListManualProps {
    umamusume: Umamusume | undefined;
    onReturn: () => void;
}

export interface RemainingRaceListAutoProps {
    umamusume: Umamusume | undefined;
    onReturn: () => void;
}

export interface ContentProps {
    selectedContent:string;
}

export interface SidebarProps {
    onTabClick: (content:string) => void;
}

export interface SidebarTabProps {
    name: string;
    onClick: (content:string) => void;
    img: string;
    url: string;
}