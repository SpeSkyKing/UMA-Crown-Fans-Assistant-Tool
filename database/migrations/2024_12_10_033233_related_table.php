<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        //声優テーブル
        Schema::create('umamusume_acter_table', function (Blueprint $table) {
            //主キー
            $table->integer('acter_id');
            //対象ウマ娘のID
            $table->integer('umamusume_id');
            //声優テーブル
            $table->string('acter_name');
            //性別
            $table->enum('gender',['0','1','2']);
            //誕生日
            $table->date('birthday');
            //呼び名
            $table->string('nickname');
            //主キー制約
            $table->primary('acter_id');
            //外部キー制約
            $table->foreign('umamusume_id')->references('umamusume_id')->on('umamusume_table')->onDelete('cascade');
        });

        //シナリオレーステーブル
        Schema::create('scenario_race_table', function (Blueprint $table) {
            //主キー
            $table->integer('umamusume_id');
            //主キー
            $table->integer('race_id');
            //シナリオ中何回目のレースか
            $table->integer('race_number');
            //ランダムで決定もしくは、分岐する場合に番号を格納
            $table->integer('random_group')->nullable();
            //クラシックとシニアの両方で発生するレースでどちらかを判定
            $table->boolean('senior_flag')->nullable();
            //外部キー制約
            $table->foreign('umamusume_id')->references('umamusume_id')->on('umamusume_table')->onDelete('cascade');
            //外部キー制約
            $table->foreign('race_id')->references('race_id')->on('race_table')->onDelete('cascade');
            //複合主キー
            $table->primary(['umamusume_id','race_id','race_number']);

        });

        //ユーザー登録ウマ娘テーブル
        Schema::create('regist_umamusume_table', function (Blueprint $table) {
            //主キー
            $table->integer('user_id');
            //主キー
            $table->integer('umamusume_id');
            //登録日
            $table->date('regist_date');
            //取得しているファン数
            $table->bigInteger('fans')->nullable();
            //外部キー制約
            $table->foreign('umamusume_id')->references('umamusume_id')->on('umamusume_table')->onDelete('cascade');
            //外部キー制約
            $table->foreign('user_id')->references('user_id')->on('user_table')->onDelete('cascade');
            //複合主キー
            $table->primary(['umamusume_id','user_id']);
        });

        //ウマ娘出走レーステーブル
        Schema::create('regist_umamusume_race_table', function (Blueprint $table) {
            //主キー
            $table->integer('user_id');
            //主キー
            $table->integer('umamusume_id');
            //主キー
            $table->integer('race_id');
            //登録日
            $table->date('regist_date');
            //外部キー制約
            $table->foreign(['umamusume_id','user_id'])->references(['umamusume_id','user_id'])
            ->on('regist_umamusume_table')->onDelete('cascade');
            //外部キー制約
            $table->foreign('race_id')->references('race_id')->on('race_table')->onDelete('cascade');
            //複合主キー
            $table->primary(['umamusume_id','user_id','race_id']);
        });

        //ユーザーセキュリティ情報テーブル
        Schema::create('user_security_table', function (Blueprint $table) {
            //主キー
            $table->integer('user_id');
            //パスワード変更日
            $table->date('password_changed_date');
            //二要素認証の有効判定
            $table->boolean('two_facter_enabled');
            //二要素認証のキーを格納する
            $table->string('two_facter_secret');
            //次回から自動ログインで使用する
            $table->string('remember_token');
            //メールアドレス確認日
            $table->date('email_verified_date');
            //外部キー制約
            $table->foreign('user_id')->references('user_id')->on('user_table')->onDelete('cascade');
            //主キー制約
            $table->primary('user_id');
        });

        //ユーザー履歴テーブル
        Schema::create('user_history_table', function (Blueprint $table) {
            //主キー
            $table->integer('user_id');
            //主キー
            $table->date('login_date');
            //主キー
            $table->time('login_time');
            //ログイン時のIPアドレス
            $table->string('login_ip');
            //ログイン時のOS
            $table->string('login_os');
            //ログイン時のブラウザ情報
            $table->string('login_browser');
            //ログイン時のデバイス
            $table->string('login_device');
            //ブラウザやデバイスの情報を格納
            $table->string('login_rendering_engine');
            //外部キー制約
            $table->foreign('user_id')->references('user_id')->on('user_table')->onDelete('cascade');
            //複合主キー
            $table->primary(['user_id','login_date','login_time']);
        });

        //歌唱ウマ娘テーブル
        Schema::create('vocal_umamusume_table', function (Blueprint $table) {
            //主キー
            $table->integer('umamusume_id');
            //主キー
            $table->integer('live_id');
            //外部キー制約
            $table->foreign('umamusume_id')->references('umamusume_id')->on('umamusume_table')->onDelete('cascade');
            //外部キー制約
            $table->foreign('live_id')->references('live_id')->on('live_table')->onDelete('cascade');
            //複合主キー
            $table->primary(['umamusume_id','live_id']);
        });

        //ユーザー所有ジュエルテーブル
        Schema::create('user_jewel_table', function (Blueprint $table) {
            // 主キー
            $table->integer('user_id');
            // 主キー
            $table->integer('year');
            // 主キー
            $table->integer('month');
            // 主キー
            $table->integer('day');
            // 所有ジュエル数
            $table->integer('jewel_amount');
            // 複合主キー
            $table->primary(['user_id', 'year', 'month', 'day']);
        });
    }

    public function down(): void
    {
    }
};
