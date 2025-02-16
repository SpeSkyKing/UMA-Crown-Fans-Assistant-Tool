# ウマ娘管理アプリケーション

ウマ娘全冠等管理アプリケーションは、ウマ娘の全冠称号取得のための情報管理ツールです。
 
ReactとLaravelを使用して構築され、ユーザーに対してシンプルで直感的なインターフェースを提供します。

## 機能

### 1. ウマ娘情報登録画面
- ユーザーがウマ娘の情報を簡単に登録できます。
- 出走レースと現在のファン数を入力することができます。

### 2. ウマ娘情報表示画面
- ユーザーが登録したウマ娘の情報をリストで表示します。
- この画面からファン数を変更することができます。

### 3. レース情報表示画面
- レース情報が表示されます。
- PreOPとOPは一部しか表示されないです。

### 4. 残レース情報表示画面
- ユーザーが登録したウマ娘が全冠称号を取得するための残レース情報を表示します。
- 残りのレースを管理し、ユーザーが追跡できるようにしています。
- 出走処理画面にて対象のレースに対して出走の処理を行うことができます。

### 5. ライブ情報画面
- ウマ娘のライブ楽曲情報を表示します。
- ライブ楽曲を歌唱するウマ娘情報も確認できます。

### 6. 声優情報画面
- ウマ娘キャラクターの声優に関する情報を表示します。

## 使用技術

- **フロントエンド**: React.js ,TypeScript ,Tailwind CSS
- **バックエンド**: Laravel 11 ,PHP ,MySQL
- **データベース**: MySQL

## ER図

```mermaid
erDiagram
    SESSIONS {
        string id PK
        int user_id FK
        string ip_address
        text user_agent
        longText payload
        int last_activity
    }
    
    UMAMUSUME_TABLE {
        int umamusume_id PK
        string umamusume_name
        enum turf_aptitude
        enum dirt_aptitude
        enum front_runner_aptitude
        enum early_foot_aptitude
        enum midfield_aptitude
        enum closer_aptitude
        enum sprint_aptitude
        enum mile_aptitude
        enum classic_aptitude
        enum long_distance_aptitude
    }
    
    RACE_TABLE {
        int race_id PK
        string race_name
        boolean race_state
        enum distance
        smallInt distance_detail
        int num_fans
        enum race_rank
        boolean senior_flag
        boolean classic_flag
        boolean junior_flag
        smallInt race_months
        boolean half_flag
        boolean scenario_flag
    }
    
    USER_TABLE {
        int user_id PK
        string password
        string user_name
        string email
        string phone_number
        string user_image
        date birthday
        enum gender
        string location
        string country
        boolean state
        boolean role
        string api_token
    }
    
    LIVE_TABLE {
        int live_id PK
        string live_name
        string composer
        string arranger
    }
    
    UMAMUSUME_ACTER_TABLE {
        int acter_id PK
        int umamusume_id FK
        string acter_name
        enum gender
        date birthday
        string nickname
    }
    
    SCENARIO_RACE_TABLE {
        int umamusume_id PK
        int race_id PK
        int race_number PK
        int random_group
        boolean senior_flag
    }
    
    REGIST_UMAMUSE_TABLE {
        int user_id PK
        int umamusume_id PK
        date regist_date
        bigInt fans
    }
    
    REGIST_UMAMUSE_RACE_TABLE {
        int user_id PK
        int umamusume_id PK
        int race_id PK
        date regist_date
    }
    
    USER_SECURITY_TABLE {
        int user_id PK
        date password_changed_date
        boolean two_facter_enabled
        string two_facter_secret
        string remember_token
        date email_verified_date
    }
    
    USER_HISTORY_TABLE {
        int user_id PK
        date login_date PK
        time login_time PK
        string login_ip
        string login_os
        string login_browser
        string login_device
        string login_rendering_engine
    }
    
    VOCAL_UMAMUSE_TABLE {
        int umamusume_id PK
        int live_id PK
    }
    
    %% リレーションシップ
    UMAMUSUME_TABLE ||--|| UMAMUSUME_ACTER_TABLE : "has"
    UMAMUSUME_TABLE ||--o{ SCENARIO_RACE_TABLE : "participates in"
    RACE_TABLE ||--o{ SCENARIO_RACE_TABLE : "features"
    USER_TABLE ||--o{ REGIST_UMAMUSE_TABLE : "registers"
    UMAMUSUME_TABLE ||--o{ REGIST_UMAMUSE_TABLE : "is registered"
    REGIST_UMAMUSE_TABLE ||--o{ REGIST_UMAMUSE_RACE_TABLE : "joins"
    RACE_TABLE ||--o{ REGIST_UMAMUSE_RACE_TABLE : "includes"
    USER_TABLE ||--|| USER_SECURITY_TABLE : "secured by"
    USER_TABLE ||--o{ USER_HISTORY_TABLE : "logs"
    UMAMUSUME_TABLE ||--o{ VOCAL_UMAMUSE_TABLE : "sings"
    LIVE_TABLE ||--o{ VOCAL_UMAMUSE_TABLE : "features"

