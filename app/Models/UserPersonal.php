<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

use Illuminate\Foundation\Auth\User as Authenticatable;

class UserPersonal extends Authenticatable
{

    use HasFactory, HasApiTokens;

    protected $primaryKey = 'user_id';

    protected $table = 'user_table';

    public $timestamps = false;
    
    /**
     * 1対多を明示的に表示
     */
    public function RegistUmamusume(){
        return $this->belongTo(RegistUmamusume::class,'user_id','user_id');   
    }

    /**
     * 1対1を明示的に表示
     */
    public function UserHistory(){
        return $this->hasOne(UserHistory::class,'user_id','user_id');   
    }

    /**
     * 1対1を明示的に表示
     */
    public function UserSecurity(){
        return $this->hasOne(UserSecurity::class,'user_id','user_id');   
    }

    /**
     * 1対多対1を明示的に表示
     */
    public function Umamusume(){
        return $this->hasManyThrough(Umamusume::class,RegistUmamusume::class);
    }
}
