<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use App\Models\Jewel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Common\UmamusumeLog;
use Illuminate\Support\Facades\Auth;

//声優関連のデータを取得する、コントローラー
class JewelController extends Controller
{
    //ログ記載用オブジェクト
    private UmamusumeLog $umamusumeLoger;

    //ログ属性用変数
    private string $logAttribute; 

    public function __construct()
    {
        $this->umamusumeLoger = new UmamusumeLog();
    }

    //ジュエルのリストをデータベースから取得するAPI
    //引数 Request
    //戻り値 JsonResponse
    public function jewelList(Request $request) : JsonResponse
    {
        $this->logAttribute = 'jewelList';

        $this->umamusumeLoger->logwrite(msg: 'start',attribute: $this->logAttribute);

        $userId = Auth::user()->user_id;

        $year = $request->json('year');

        $month = $request->json('month');

        $jewel = Jewel::where('user_id',$userId)
                      ->where('year',$year)
                      ->where('month',$month)
                      ->orderBy('day','asc')->get();

        $this->umamusumeLoger->logwrite(msg: 'end',attribute: $this->logAttribute);

        return response()->json(['data' => $jewel]);
    }

    // 当日のジュエルを登録するAPI
    // 引数 Request
    // 戻り値 JsonResponse
    public function jewelRegist(Request $request) : JsonResponse
    {
        $this->logAttribute = 'jewelRegist';

        $this->umamusumeLoger->logwrite(msg: 'start',attribute: $this->logAttribute);

        $userId = Auth::user()->user_id;

        $now = Carbon::now();

        try{
            $jewel = new Jewel();
            $jewel->user_id = $userId;
            $jewel->year = $now->year;
            $jewel->month = $now->month;
            $jewel->day = $now->day;
            $jewel->jewel_amount = $request->json('jewel');
            $jewel->save();
        }catch (\Exception $e) {
            $this->umamusumeLoger->logwrite(msg: 'error',attribute:$this->logAttribute.':'.$e);
            $this->umamusumeLoger->logwrite(msg: 'end',attribute: $this->logAttribute);
            return response()->json(['error' => 'ジュエル登録エラー'], 500);
        }
        $this->umamusumeLoger->logwrite(msg: 'end',attribute: $this->logAttribute);
        return response()->json([
            'message' => 'ジュエルが登録されました。'
        ], 201);
    }
}
