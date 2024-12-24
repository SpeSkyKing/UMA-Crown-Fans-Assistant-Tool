<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Race extends Model
{

    protected $primaryKey = 'race_id';

    protected $table = 'race_table';

    public $timestamps = false;

    /**
     * 1対多を明示的に表示
     */
    public function RegistUmamusumeEntry(){
        return $this->belongTo(RegistUmamusumeRace::class,'race_id','race_id');   
    }

    /**
     * 1対多を明示的に表示
     */
    public function ScenarioRace(){
        return $this->belongTo(ScenarioRace::class,'race_id','race_id');   
    }

    /**
     * 1対多対1を明示的に表示
     */
    public function RegistUmamusume(){
        return $this->hasManyThrough(RegistUmamusume::class,RegistUmamusumeRace::class);
    }

     /**
     * 1対多対1を明示的に表示
     */
    public function Race(){
        return $this->hasManyThrough(Race::class,ScenarioRace::class);
    }
}
