<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        //セッションテーブル　※Laravelでは必要
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

        //ウマ娘テーブル
        Schema::create('umamusume_table', function (Blueprint $table) {
            //主キー
            $table->integer('umamusume_id');
            //ウマ娘の名前
            $table->string('umamusume_name');
            //芝適性
            $table->enum('turf_aptitude',['A','B','C','D','E','F','G']);
            //ダート適性
            $table->enum('dirt_aptitude',['A','B','C','D','E','F','G']);
            //逃げ適性
            $table->enum('front_runner_aptitude',['A','B','C','D','E','F','G']);
            //先行適性
            $table->enum('early_foot_aptitude',['A','B','C','D','E','F','G']);
            //差し適性
            $table->enum('midfield_aptitude',['A','B','C','D','E','F','G']);
            //追込適性
            $table->enum('closer_aptitude',['A','B','C','D','E','F','G']);
            //短距離適性
            $table->enum('sprint_aptitude',['A','B','C','D','E','F','G']);
            //マイル適性
            $table->enum('mile_aptitude',['A','B','C','D','E','F','G']);
            //中距離適性
            $table->enum('classic_aptitude',['A','B','C','D','E','F','G']);
            //長距離適性
            $table->enum('long_distance_aptitude',['A','B','C','D','E','F','G']);
            //主キー制約を設定
            $table->primary('umamusume_id');
        });

        //レーステーブル
        Schema::create('race_table', function (Blueprint $table) {
            //主キー
            $table->integer('race_id');
            //レース名
            $table->string('race_name');
            //芝かダートかを判定する
            $table->boolean('race_state');
            //距離　1:短距離 2:マイル 3:中距離 4:長距離
            $table->enum('distance',['1','2','3','4']);
            //距離詳細　〇〇mの〇〇を格納
            $table->smallInteger('distance_detail');
            //獲得ファン数
            $table->integer('num_fans');
            //レースのランク 1:G1 2:G2 3:G3 4:OP 5:Pre
            $table->enum('race_rank',['1','2','3','4','5']);
            //シニア期で発生するか？
            $table->boolean('senior_flag');
            //クラシック期で発生するか？
            $table->boolean('classic_flag');
            //ジュニア期で発生するか？
            $table->boolean('junior_flag');
            //出走月
            $table->smallInteger('race_months');
            //前半か後半か
            $table->boolean('half_flag');
            //特定のシナリオのみのレースか
            $table->boolean('scenario_flag');
            //主キー制約を設定
            $table->primary('race_id');
        });

        //ユーザーテーブル
        Schema::create('user_table', function (Blueprint $table) {
            //主キー
            $table->integer('user_id');
            //パスワード
            $table->string('password');
            //ユーザー名
            $table->string('user_name');
            //メールアドレス
            $table->string('email')->nullable();
            //電話番号
            $table->string('phone_number')->nullable();
            //ユーザー設定画像
            $table->string('user_image')->nullable();
            //誕生日
            $table->date('birthday')->nullable();
            //性別
            $table->enum('gender',['0','1','2']);
            //住所
            $table->string('location')->nullable();
            //国名
            $table->string('country')->nullable();
            //使用状態
            $table->boolean('state');
            //役割
            $table->boolean('role');
            //APIトークン
            $table->string('api_token', 80)->nullable()->unique();
            //主キー制約を設定
            $table->primary('user_id');
        });

        //ライブテーブル
        Schema::create('live_table', function (Blueprint $table) {
            //主キー
            $table->integer('live_id');
            //曲名
            $table->string('live_name');
            //作曲家
            $table->string('composer');
            //編曲家
            $table->string('arranger');
            //主キー制約を設定
            $table->primary('live_id');
        });
    }

    public function down(): void
    {
        //トランザクションテーブルを削除する
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('regist_umamusume_race_table');
        Schema::dropIfExists('user_security_table');
        Schema::dropIfExists('user_history_table');
        Schema::dropIfExists('regist_umamusume_table');
        Schema::dropIfExists('umamusume_acter_table');
        Schema::dropIfExists('scenario_race_table');
        Schema::dropIfExists('vocal_umamusume_table');

        //マスタテーブルを削除する
        Schema::dropIfExists('umamusume_table');
        Schema::dropIfExists('race_table');
        Schema::dropIfExists('user_table');
        Schema::dropIfExists('live_table');
    }
};
