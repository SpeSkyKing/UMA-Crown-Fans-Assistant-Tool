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
    checked:boolean;
}

export interface RemainingRace{
    umamusume:Umamusume;
    isAllCrown:boolean;
    allCrownRace:number;
    turfSprintRace:number;
    turfMileRace:number;
    turfClassicRace:number;
    turfLongDistanceRace:number;
    dirtSprintDistanceRace:number;
    dirtMileRace:number;
    dirtClassicRace:number;
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

export interface RegistUmamusume{
    umamusume:Umamusume;
    fans:number;
}

export interface User{
    user_id:number;
    user_name:string;
    password:string;
    email:string;
    phone_number:string;
    user_image:string;
    birthday:Date;
    gender:number;
    location:string;
    country:string;
    state:boolean;
    role:boolean;
    api_token:string;
}

export interface Live{
    live_id:number;
    live_name:string;
    composer:string;
    arranger:string;
    umamusume:Umamusume;
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