<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\Common\UmamusumeLog;
use Illuminate\Http\JsonResponse;
use App\Models\Live;
use App\Models\VocalUmamusume;

//ライブ関連のデータを取得する、コントローラー
class LiveController extends Controller
{
    //ログ記載用オブジェクト
    private UmamusumeLog $umamusumeLoger;

    //ログ属性用変数
    private string $logAttribute; 
    
    public function __construct()
    {
        $this->umamusumeLoger = new UmamusumeLog();
    }
    //ライブのリストをデータベースから取得するAPI
    //引数 なし
    //戻り値 JsonResponse
    public function liveList() : JsonResponse
    {
        $this->logAttribute = 'liveList';

        $this->umamusumeLoger->logwrite(msg: 'start',attribute: $this->logAttribute);

        $liveList = Live::all();

        $this->umamusumeLoger->logwrite(msg: 'end',attribute: $this->logAttribute);

        return response()->json(['data' => $liveList]);
    }

    //ライブのIDを引数として、紐づくウマ娘の情報をDBから取得するAPI
    //引数 Request 
    //戻り値 JsonResponse
    public function umamusumeList( Request $request) : JsonResponse
    {
        $this->logAttribute = 'umamusumeList';

        $this->umamusumeLoger->logwrite(msg: 'start',attribute: $this->logAttribute);

        $liveId = $request->json('liveId');

        $umamusumes = VocalUmamusume::where('live_id',$liveId)->get();

        $this->umamusumeLoger->logwrite(msg: 'end',attribute: $this->logAttribute);

        return response()->json(['data' => $umamusumes->pluck('Umamusume')]);
    }
}
