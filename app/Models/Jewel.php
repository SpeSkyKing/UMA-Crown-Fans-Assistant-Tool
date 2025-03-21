<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jewel extends Model
{

    protected $table = 'user_jewel_table';

    public $timestamps = false;
 
    /**
     * 多対1を明示的に表示
     */
    public function User(){
        return $this->hasOne(UserPersonal::class,'user_id','user_id');   
    }
}
