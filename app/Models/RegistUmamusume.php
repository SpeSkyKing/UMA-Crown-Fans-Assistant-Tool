<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegistUmamusume extends Model
{

    protected $table = 'regist_umamusume_table';

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
    public function User(){
        return $this->hasOne(UserPersonal::class,'user_id','user_id');   
    }

    /**
     * 1対多を明示的に表示
     */
    public function RegistUmamusumeRace(){
        return RegistUmamusumeRace::where('umamusume_id',$this->umamusume_id)
        ->where('race_id',$this->race_id)->first();
    }

    /**
     * 1対多対1を明示的に表示
     */
    public function Race(){
        return $this->hasManyThrough(Race::class,RegistUmamusumeRace::class);
    }

}
