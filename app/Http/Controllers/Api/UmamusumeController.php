<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Common\UmamusumeLog;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Models\Umamusume;
use App\Models\RegistUmamusume;
use App\Models\RegistUmamusumeRace;

//ウマ娘のデータを取得するコントローラー
class UmamusumeController extends Controller
{
    //ログ記載用オブジェクト
    private UmamusumeLog $umamusumeLoger;
    
    //ログ属性用変数
    private string $logAttribute; 
    public function __construct()
    {
        $this->umamusumeLoger = new UmamusumeLog();
    }

    //ユーザーが登録していない、ウマ娘情報を取得するAPI
    // 引数
    // 戻り値 JsonResponse
    public function registList() : JsonResponse
    {
        $this->logAttribute = 'registList';

        $this->umamusumeLoger->logwrite(msg: 'start',attribute: $this->logAttribute);

        $userId = Auth::user()->user_id;

        $registUmamusumeIds = RegistUmamusume::where('user_id', $userId)->pluck('umamusume_id')->toArray();
        
        $umamusume = Umamusume::whereNotIn('umamusume_id', $registUmamusumeIds)->get();

        $this->umamusumeLoger->logwrite(msg: 'end',attribute: $this->logAttribute);
        
        return response()->json(['data' => $umamusume]);
        
    }

    //ユーザーが選択した、ウマ娘のデータを登録するAPI
    // 引数
    // 戻り値 JsonResponse
    public function regist( Request $request) : JsonResponse
    {
        $this->logAttribute = 'regist';

        $this->umamusumeLoger->logwrite(msg: 'start',attribute: $this->logAttribute);

        $umamusumeId = $request->get('umamusumeId');
        $raceIdArray = $request->get('raceIdArray');
        $userId = Auth::user()->user_id;
        $userName = Auth::user()->user_name;
        $fans = $request->get('fans');
        try{
            $registUmamusume = new RegistUmamusume();
            $registUmamusume->user_id = $userId;
            $registUmamusume->umamusume_id = $umamusumeId;
            $registUmamusume->regist_date = Carbon::now();
            $registUmamusume->fans = $fans;
            $registUmamusume->save();
            if($raceIdArray){
                foreach($raceIdArray as $race){
                    $registUmamusumeRace = new RegistUmamusumeRace();
                    $registUmamusumeRace->user_id = $userId;
                    $registUmamusumeRace->umamusume_id = $umamusumeId;
                    $registUmamusumeRace->race_id = $race;
                    $registUmamusumeRace->regist_date = Carbon::now();
                    $registUmamusumeRace->save();
                }
            }
        }catch (\Exception $e) {
            $this->umamusumeLoger->logwrite(msg: 'error',attribute:$this->logAttribute.':'.$e);
            $this->umamusumeLoger->logwrite(msg: 'end',attribute: $this->logAttribute);
            return response()->json(['error' => 'ウマ娘登録エラー'], 500);
        }
        $this->umamusumeLoger->logwrite(msg: 'end',attribute: $this->logAttribute);
        return response()->json([
            'message' => 'ユーザーが登録されました。'
        ], 201);
    }

    //ユーザーが登録したウマ娘の情報を取得するAPI
    // 引数
    // 戻り値 JsonResponse
    public function userRegist() : JsonResponse
    {
        $this->logAttribute = 'userRegist';

        $this->umamusumeLoger->logwrite(msg: 'start',attribute: $this->logAttribute);

        $userId = Auth::user()->user_id;

        $registUmamusume = RegistUmamusume::where('user_id', $userId)->with('umamusume')->get();

        $this->umamusumeLoger->logwrite(msg: 'end',attribute: $this->logAttribute);
        
        return response()->json(['data' => $registUmamusume]);
    }

    //ユーザーが入力したファン数をユーザーが登録したウマ娘データに反映させるAPI
    // 引数
    // 戻り値 JsonResponse
    public function fanUp( Request $request) : JsonResponse
    {
        $this->logAttribute = 'fanUp';

        $this->umamusumeLoger->logwrite(msg: 'start',attribute: $this->logAttribute);

        $userId = Auth::user()->user_id;

        $umamusumeId = $request->json('umamusumeId');

        $fans = $request->json('fans');
        
        RegistUmamusume::where('user_id', $userId)->where('umamusume_id',$umamusumeId)
        ->update(['fans' => $fans]);

        $this->umamusumeLoger->logwrite(msg: 'end',attribute: $this->logAttribute);

        return response()->json([
            'message' => 'ファン数が変更されました'
        ], 201);
    }
}
