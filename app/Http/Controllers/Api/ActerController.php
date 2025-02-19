<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Models\UmamusumeActer;


//声優関連のデータを取得する、コントローラー
class ActerController extends Controller
{
 
    //声優のリストをデータベースから取得するAPI
    //引数 なし
    //戻り値 JsonResponse
    public function acterList() : JsonResponse
    {
        $acters = UmamusumeActer::with('Umamusume')
        ->orderBy('birthday','desc')->get();

        return response()->json(['data' => $acters]);
    }
}
