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
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

        Schema::create('umamusume_table', function (Blueprint $table) {
            $table->integer('umamusume_id');
            $table->string('umamusume_name');
            $table->enum('turf_aptitude',['A','B','C','D','E','F','G']);
            $table->enum('dirt_aptitude',['A','B','C','D','E','F','G']);
            $table->enum('front_runner_aptitude',['A','B','C','D','E','F','G']);
            $table->enum('early_foot_aptitude',['A','B','C','D','E','F','G']);
            $table->enum('midfield_aptitude',['A','B','C','D','E','F','G']);
            $table->enum('closer_aptitude',['A','B','C','D','E','F','G']);
            $table->enum('sprint_aptitude',['A','B','C','D','E','F','G']);
            $table->enum('mile_aptitude',['A','B','C','D','E','F','G']);
            $table->enum('classic_aptitude',['A','B','C','D','E','F','G']);
            $table->enum('long_distance_aptitude',['A','B','C','D','E','F','G']);
            $table->primary('umamusume_id');
        });

        Schema::create('race_table', function (Blueprint $table) {
            $table->integer('race_id');
            $table->string('race_name');
            $table->boolean('race_state');
            $table->enum('distance',['1','2','3','4']);
            $table->smallInteger('distance_detail');
            $table->integer('num_fans');
            $table->enum('race_rank',['1','2','3','4','5']);
            $table->boolean('senior_flag');
            $table->boolean('classic_flag');
            $table->boolean('junior_flag');
            $table->smallInteger('race_months');
            $table->boolean('half_flag');
            $table->boolean('scenario_flag');
            $table->primary('race_id');
        });

        Schema::create('user_table', function (Blueprint $table) {
            $table->integer('user_id');   
            $table->string('password');
            $table->string('user_name');
            $table->string('email');
            $table->string('phone_number');
            $table->string('user_image')->nullable();
            $table->date('birthday');
            $table->enum('gender',['0','1','2']);
            $table->string('location');
            $table->string('country');
            $table->boolean('state');
            $table->boolean('role');
            $table->string('api_token', 80)->nullable()->unique();
            $table->primary('user_id');
        });

        Schema::create('live_table', function (Blueprint $table) {
            $table->integer('live_id');
            $table->string('live_name');
            $table->string('composer');
            $table->string('arranger');
            $table->primary('live_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('regist_umamusume_race_table');

        Schema::dropIfExists('user_security_table');
        Schema::dropIfExists('user_history_table');
        Schema::dropIfExists('regist_umamusume_table');
        Schema::dropIfExists('umamusume_acter_table');
        Schema::dropIfExists('scenario_race_table');
        Schema::dropIfExists('vocal_umamusume_table');

        Schema::dropIfExists('umamusume_table');
        Schema::dropIfExists('race_table');
        Schema::dropIfExists('user_table');
        Schema::dropIfExists('live_table');
    }
};
