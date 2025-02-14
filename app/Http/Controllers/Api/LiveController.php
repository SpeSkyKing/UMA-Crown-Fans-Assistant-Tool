<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Live;
use App\Models\VocalUmamusume;

//ライブ関連のデータを取得する、コントローラー
class LiveController extends Controller
{
    //ライブのリストをデータベースから取得するAPI
    public function liveList(){
        $liveList = Live::all();
        return response()->json(['data' => $liveList]);
    }

    //ライブのIDを引数として、紐づくウマ娘の情報をDBから取得するAPI
    public function umamusumeList(Request $request){
        $liveId = $request->json('liveId');
        $umamusumes = VocalUmamusume::where('live_id',$liveId)->get();
        return response()->json(['data' => $umamusumes->pluck('Umamusume')]);
    }
}
