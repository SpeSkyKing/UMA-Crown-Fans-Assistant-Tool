<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Live extends Model
{

    protected $primaryKey = 'live_id';

    protected $table = 'live_table';

    public $timestamps = false;
 
     /**
     * 1対多を明示的に表示
     */
    public function VocalUmamusume(){
        return $this->belongTo(VocalUmamusume::class,'live_id','live_id');   
    }

     /**
     * 1対多対1を明示的に表示
     */
    public function Umamusume(){
        return $this->hasManyThrough(Umamusume::class,VocalUmamusume::class);
    }
}
