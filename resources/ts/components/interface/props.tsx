import { Umamusume , Race , Live , Acter , RemainingRace , RegistUmamusume } from './interface';

/*
 * layout Start
 */

//content.tsxで利用する
export interface ContentProps {
    selectedContent:string;
}

//Sidebar.tsxで利用する
export interface SidebarProps {
    onTabClick: (content:string) => void;
}

//sidebarTab.tsxで利用する
export interface SidebarTabProps {
    name: string;
    onClick: (content:string) => void;
    img: string;
    url: string;
}

/*
 * layout End
 */

/*
 * auth Start
 */

//auth.tsxで利用する
export interface AuthProps {
    onLogin: () => void;
}

//passwordForget.tsxで利用する
export interface PasswordForgetProps {
    onReturn: () => void;
}

//regist.tsxで利用する
export interface RegistProps {
    onReturn: () => void;
    onRegist: (Username: string, password: string) => void;
}

/*
 * auth End
 */



/*
 * common Start
 */

//header.tsxで利用する
export interface HeaderProps{
    ItemArray: Item[];
}

//header.tsxで利用する
export interface Item {
    display: string;
}

//inputField.tsxで利用する
export interface InputFieldProps {
    id: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'tel' | 'date' | 'file';
    value: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    accept?: string;
}

//tdItem.tsxで利用する
export interface TdItemProps {
    content:string
}

/*
 * common End
 */



/*
 * characterRegist Start
 */

//aptitude.tsxで利用する
export interface AptitudeProps {
    name: string;
    aptitude: string;
}

//characterRegistData.tsxで利用する
export interface CharacterRegistDataProps {
    race: Race;
    checked: boolean;
    onCheckboxChange: (raceId: number,checked:boolean) => void;
}


/*
 * characterRegist End
 */



/*
 * characterList Start
 */

//characterListData.tsxで利用する
export interface CharacterListDataProps {
    registUmamusume: RegistUmamusume;
    returnFanUp:(registUmamusume:RegistUmamusume) => void;
}

//characterListFans.tsxで利用する
export interface CharacterListFansProps {
    selectUmamusume: RegistUmamusume | undefined;
    countUp        : (fan:number) => void;
    returnAddFan   : () => void;
    returnOnReturn : () => void;
}

/*
 * characterList End
 */



/*
 * raceList Start
 */

//raceListData.tsxで利用する
export interface RaceListDataProps {
    race: Race;
}

/*
 * raceList End
 */



/*
 * remainingRaceList Start
 */

//remainingRaceListData.tsxで利用する
export interface RemainingRaceListDataProps {
    remainingRace: RemainingRace;
    checkRaces: (umamusume: Umamusume) => void;   
}

//remainingRaceListItem.tsxで利用する
export interface RemainingRaceListItemProps {
    race: Race;
    runRace: (race_id: number) => void;
}

//remainingRaceListManual.tsxで利用する
export interface RemainingRaceListManualProps {
    umamusume: Umamusume ;
    onReturn: () => void;
}

/*
 * remainingRaceList End
 */



/*
 * acterList Start
 */

//acterListData.tsxで利用する
export interface ActerListDataProps {
    acter: Acter;
}

/*
 * acterList End
 */



/*
 * liveList Start
 */

//liveListData.tsxで利用する
export interface LiveListDataProps {
    live: Live;
    onClick: (live : Live) => void;
}

//liveListCharacterData.tsxで利用する
export interface LiveListCharacterDataProps{
    umamusume: Umamusume;
}

/*
 * liveList End
 */