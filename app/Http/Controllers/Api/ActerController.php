<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Models\UmamusumeActer;
use App\Http\Controllers\Common\UmamusumeLog;


//声優関連のデータを取得する、コントローラー
class ActerController extends Controller
{
    //ログ記載用オブジェクト
    private UmamusumeLog $umamusumeLoger;

    //ログ属性用変数
    private string $logAttribute; 

    public function __construct()
    {
        $this->umamusumeLoger = new UmamusumeLog();
    }
    //声優のリストをデータベースから取得するAPI
    //引数 なし
    //戻り値 JsonResponse
    public function acterList() : JsonResponse
    {
        $this->logAttribute = 'acterList';

        $this->umamusumeLoger->logwrite(msg: 'start',attribute: $this->logAttribute);

        $acters = UmamusumeActer::with('Umamusume')
        ->orderBy('birthday','desc')->get();

        $this->umamusumeLoger->logwrite(msg: 'end',attribute: $this->logAttribute);

        return response()->json(['data' => $acters]);
    }
}
