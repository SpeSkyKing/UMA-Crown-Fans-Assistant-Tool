<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('umamusume_acter_table', function (Blueprint $table) {
            $table->integer('acter_id');
            $table->integer('umamusume_id');
            $table->string('acter_name');
            $table->enum('gender',['0','1','2']);
            $table->date('birthday');
            $table->string('nickname');
            $table->primary('acter_id');
            $table->foreign('umamusume_id')->references('umamusume_id')->on('umamusume_table')->onDelete('cascade');
        });

        Schema::create('scenario_race_table', function (Blueprint $table) {
            $table->integer('umamusume_id');
            $table->integer('race_id');
            $table->integer('race_number');
            $table->integer('random_group')->nullable();
            $table->boolean('senior_flag')->nullable();
            $table->foreign('umamusume_id')->references('umamusume_id')->on('umamusume_table')->onDelete('cascade');
            $table->foreign('race_id')->references('race_id')->on('race_table')->onDelete('cascade');
            $table->primary(['umamusume_id','race_id','race_number']);

        });

        Schema::create('regist_umamusume_table', function (Blueprint $table) {
            $table->integer('user_id');
            $table->integer('umamusume_id');
            $table->date('regist_date');
            $table->bigInteger('fans')->nullabe();
            $table->foreign('umamusume_id')->references('umamusume_id')->on('umamusume_table')->onDelete('cascade');
            $table->foreign('user_id')->references('user_id')->on('user_table')->onDelete('cascade');
            $table->primary(['umamusume_id','user_id']);
        });

        Schema::create('regist_umamusume_race_table', function (Blueprint $table) {
            $table->integer('user_id');
            $table->integer('umamusume_id');
            $table->integer('race_id');
            $table->date('regist_date');
            $table->foreign(['umamusume_id','user_id'])->references(['umamusume_id','user_id'])
            ->on('regist_umamusume_table')->onDelete('cascade');
            $table->foreign('race_id')->references('race_id')->on('race_table')->onDelete('cascade');
            $table->primary(['umamusume_id','user_id','race_id']);
        });

        Schema::create('user_security_table', function (Blueprint $table) {
            $table->integer('user_id');
            $table->date('email_accept_date');
            $table->date('password_changed_date');
            $table->boolean('two_facter_enabled');
            $table->string('two_facter_secret');
            $table->string('remember_token');
            $table->date('email_verified_date');
            $table->bigInteger('fans');
            $table->foreign('user_id')->references('user_id')->on('user_table')->onDelete('cascade');
            $table->primary('user_id');
        });

        Schema::create('user_history_table', function (Blueprint $table) {
            $table->integer('user_id');
            $table->date('login_date');
            $table->time('login_time');
            $table->string('login_ip');
            $table->string('login_os');
            $table->string('login_browser');
            $table->string('login_device');
            $table->string('login_rendering_engine');
            $table->foreign('user_id')->references('user_id')->on('user_table')->onDelete('cascade');
            $table->primary(['user_id','login_date','login_time']);
        });

        Schema::create('vocal_umamusume_table', function (Blueprint $table) {
            $table->integer('umamusume_id');
            $table->integer('live_id');
            $table->foreign('umamusume_id')->references('umamusume_id')->on('umamusume_table')->onDelete('cascade');
            $table->foreign('live_id')->references('live_id')->on('live_table')->onDelete('cascade');
            $table->primary(['umamusume_id','live_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    }
};
