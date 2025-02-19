<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Live;
use App\Models\VocalUmamusume;

//ライブ関連のデータを取得する、コントローラー
class LiveController extends Controller
{
    //ライブのリストをデータベースから取得するAPI
    //引数 なし
    //戻り値 JsonResponse
    public function liveList() : JsonResponse
    {
        $liveList = Live::all();
        return response()->json(['data' => $liveList]);
    }

    //ライブのIDを引数として、紐づくウマ娘の情報をDBから取得するAPI
    //引数 Request 
    //戻り値 JsonResponse
    public function umamusumeList( Request $request) : JsonResponse
    {
        $liveId = $request->json('liveId');
        $umamusumes = VocalUmamusume::where('live_id',$liveId)->get();
        return response()->json(['data' => $umamusumes->pluck('Umamusume')]);
    }
}
