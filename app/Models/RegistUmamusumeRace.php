<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegistUmamusumeRace extends Model
{
    protected $table = 'regist_umamusume_race_table';

    public $timestamps = false;
    
    /**
     * 多対1を明示的に表示
     */
    public function RegistUmamusume(){
        return RegistUmamusume::where('umamusume_id',$this->umamusume_id)
        ->where('race_id',$this->race_id)->first();
    }

    /**
     * 多対1を明示的に表示
     */
    public function Race(){
        return $this->hasOne(Race::class,'race_id','race_id');   
    }
}
