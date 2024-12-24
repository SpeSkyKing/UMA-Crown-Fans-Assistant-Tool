<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScenarioRace extends Model
{

    protected $table = 'scenario_race_table';

    public $timestamps = false;
    
    /**
     * 多対1を明示的に表示
     */
    public function Umamusume(){
        return $this->hasOne(Umamusume::class,'umamusume_id','umamusume_id');   
    }

    /**
     * 多対1を明示的に表示
     */
    public function Race(){
        return $this->hasOne(Race::class,'race_id','race_id');   
    }
}
