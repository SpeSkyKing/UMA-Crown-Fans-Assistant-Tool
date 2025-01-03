<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VocalUmamusume extends Model
{
    protected $table = 'vocal_umamusume_table';

    public $timestamps = false;
    
    /**
     * 多対1を明示的に表示
     */
    public function Live(){
        return $this->hasOne(Live::class,'live_id','live_id');   
    }

    /**
     * 多対1を明示的に表示
     */
    public function Umamusume(){
        return $this->hasOne(Umamusume::class,'umamusume_id','umamusume_id');   
    }
}
