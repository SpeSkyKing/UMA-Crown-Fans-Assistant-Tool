<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Umamusume extends Model
{

    protected $primaryKey = 'umamusume_id';

    protected $table = 'umamusume_table';

    public $timestamps = false;

    /**
     * 1対多を明示的に表示
     */
    public function VocalUmamusume(){
        return $this->belongTo(VocalUmamusume::class,'umamusume_id','umamusume_id');   
    }

    /**
     * 1対多を明示的に表示
     */
    public function ScenarioRace(){
        return $this->belongTo(ScenarioRace::class,'umamusume_id','umamusume_id');   
    }

    /**
     * 1対多を明示的に表示
     */
    public function RegistUmamusume(){
        return $this->belongTo(RegistUmamusume::class,'umamusume_id','umamusume_id');   
    }

    /**
     * 1対1を明示的に表示
     */
    public function UmamusumeActer(){
        return $this->hasOne(UmamusumeActer::class,'umamusume_id','umamusume_id');   
    }

    /**
     * 1対多対1を明示的に表示
     */
    public function Vocal(){
        return $this->hasManyThrough(Live::class,VocalUmamusume::class);
    }

    /**
     * 1対多対1を明示的に表示
     */
    public function RegistUmamusumeEntry(){
        return $this->hasManyThrough(RegistUmamusumeRace::class,RegistUmamusume::class);
    }

    /**
     * 1対多対1を明示的に表示
     */
    public function Race(){
        return $this->hasManyThrough(Race::class,ScenarioRace::class);
    }
    
}
