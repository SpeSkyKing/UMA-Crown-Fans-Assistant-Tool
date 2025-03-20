//ユーザー情報を格納するインターフェース
export interface User{
    //主キー
    user_id:number;
    //ユーザー名
    user_name:string;
    //パスワード
    password:string;
    //メールアドレス
    email:string;
    //電話番号
    phone_number:string;
    //ユーザー画像
    user_image:string;
    //誕生日
    birthday:Date;
    //性別
    gender:number;
    //住所
    location:string;
    //国
    country:string;
    //使用状態
    state:boolean;
    //役割
    role:boolean;
    //APIトークン
    api_token:string;
}

//ウマ娘用インターフェース
export interface Umamusume{
    //主キー
    umamusume_id:number;
    //ウマ娘の名前
    umamusume_name:string;
    //芝適性
    turf_aptitude:number;
    //ダート適性
    dirt_aptitude:number;
    //逃げ適性
    front_runner_aptitude:number;
    //先行適性
    early_foot_aptitude:number;
    //差し適性
    midfield_aptitude:number;
    //追込適性
    closer_aptitude:number;
    //短距離適性
    sprint_aptitude:number;
    //マイル適性
    mile_aptitude:number;
    //中距離適性
    classic_aptitude:number;
    //長距離適性
    long_distance_aptitude:number;
    //対象の声優オブジェクトを格納
    acter:Acter;
}

//ユーザーによって登録されたウマ娘情報を格納するインターフェース
export interface RegistUmamusume{
    //ウマ娘オブジェクト
    umamusume:Umamusume;
    //ファン数
    fans:number;
}

//レーステーブル用インターフェース
export interface Race {
    //主キー
    race_id: number;
    //レース名
    race_name: string;
    //芝かダートか判定
    race_state: boolean;
    //距離
    distance: number;
    //距離詳細
    distance_detail: number;
    //獲得ファン数
    num_fans: number;
    //レースランク
    race_rank: number;
    //シニア期で発生するか？
    senior_flag: boolean;
    //クラシック期で発生するか？
    classic_flag: boolean;
    //ジュニア期で発生するか？
    junior_flag: boolean;
    //出走月
    race_months: number;
    //前半か後半か
    half_flag: boolean;
    //特定のシナリオのみのレースか
    scenario_flag: boolean;
    //チェックがついているかの判定
    checked:boolean;
}

//特定のウマ娘に対しての残レース数を格納するインターフェース
export interface RemainingRace{
    //ウマ娘オブジェクト
    umamusume:Umamusume;
    //全冠か判定する
    isAllCrown:boolean;
    //全ての残レース数を格納する
    allCrownRace:number;
    //芝・短距離の残レース数
    turfSprintRace:number;
    //芝・マイルの残レース数
    turfMileRace:number;
    //芝・中距離の残レース数
    turfClassicRace:number;
    //芝・長距離の残レース数
    turfLongDistanceRace:number;
    //ダート・短距離の残レース数
    dirtSprintDistanceRace:number;
    //ダート・マイルの残レース数
    dirtMileRace:number;
    //ダート・中距離の残レース数
    dirtClassicRace:number;
}

//暫定　全冠への必要計算処理用のインターフェース
export interface RaceEntryPattern{
    //推奨因子
    requiredsFactor:string[],
    //推奨シナリオ
    selectScenario:string
}

//ファン数効率計算処理で表示するレース情報を格納するインターフェース
export interface ReservedRace{
    //レース名
    race_name: string;
    //距離
    distance: number;
    //距離詳細
    distance_detail: number;
    //獲得ファン数
    num_fans: number;
    //期 1:ジュニア 2:クラシック 3:シニア
    season: number;
    //出走月
    race_months: number;
    //前後半
    half_flag: boolean;
}

//ライブ情報用インターフェース
export interface Live{
    //主キー
    live_id:number;
    //曲名
    live_name:string;
    //作曲家
    composer:string;
    //編曲家
    arranger:string;
    //ウマ娘オブジェクト
    umamusume:Umamusume;
}

//声優情報用インターフェース
export interface Acter{
    //主キー
    acter_id:number;
    //対象ウマ娘のキー
    umamusume_id:number; 
    //声優名
    acter_name:string;
    //性別
    gender:number;
    //誕生日
    birthday:Date;
    //呼び名
    nickname:string;
    //ウマ娘オブジェクト
    umamusume:Umamusume;
}

//ジュエル情報用インターフェース
export interface Jewel{
    //主キー
    user_id:number;
    //年
    year:number; 
    //月
    month:number;
    //日
    day:number;
    //ジュエル数
    jewel_amount:number;
}