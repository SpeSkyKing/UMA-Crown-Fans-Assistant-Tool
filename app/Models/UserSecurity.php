<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSecurity extends Model
{
    protected $primaryKey = 'user_id';

    protected $table = 'user_security_table';

    public $timestamps = false;

     /**
     * 1対1を明示的に表示
     */
    public function User(){
        return $this->hasOne(UserPersonal::class,'user_id','user_id');   
    }
}
