<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\UmamusumeActer;


//声優関連のデータを取得する、コントローラー
class ActerController extends Controller
{
 
    //声優のリストをデータベースから取得するAPI
    public function acterList()
    {
        $acters = UmamusumeActer::with('Umamusume')
        ->orderBy('birthday','desc')->get();

        if(is_null($acters)){
            return response()->json(['data' => $acters]);
        }

        return response()->json(['data' => $acters]);
    }
}
