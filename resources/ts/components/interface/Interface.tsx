export interface Race {
    race_id: number;
    race_name: string;
    race_state: boolean;
    distance: number;
    distance_detail: number;
    num_fans: number;
    race_rank: number;
    senior_flag: boolean;
    classic_flag: boolean;
    junior_flag: boolean;
    race_months: number;
    half_flag: boolean;
    scenario_flag: boolean;
}

export interface Umamusume{
    umamusume_id:number;
    umamusume_name:string;
    turf_aptitude:number;
    dirt_aptitude:number;
    front_runner_aptitude:number;
    early_foot_aptitude:number;
    midfield_aptitude:number;
    closer_aptitude:number;
    sprint_aptitude:number;
    mile_aptitude:number;
    classic_aptitude:number;
    long_distance_aptitude:number;
    acter:Acter;
}

export interface Acter{
    acter_id:number;
    umamusume_id:number; 
    acter_name:string;
    gender:number;
    birthday:Date;
    nickname:string;
    umamusume:Umamusume;
}

export interface Item {
    display: string;
}

export interface HeaderProps {
    ItemArray: Item[];
}