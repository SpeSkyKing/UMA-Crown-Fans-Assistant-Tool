<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Common\UmamusumeLog;
use App\Models\Race;
use App\Models\RegistUmamusume;
use App\Models\RegistUmamusumeRace;
use App\Models\Umamusume;
use App\Models\ScenarioRace;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

//レース関連のデータを取得するコントローラー
class RaceController extends Controller
{
    //ユーザーが選択したウマ娘のオブジェクトを格納する変数
    private Umamusume $selectUmamusume;

    //ログ記載用オブジェクト
    private UmamusumeLog $umamusumeLoger;

    //ログ属性用変数
    private string $logAttribute; 
    
    public function __construct()
    {
        $this->umamusumeLoger = new UmamusumeLog();
    }

    //レースのリストをDBから取得するAPI
    //引数 なし
    //戻り値 JsonResponse
    public function raceList() : JsonResponse
    {
        $this->logAttribute = 'raceList';

        $this->umamusumeLoger->logwrite(msg: 'start',attribute: $this->logAttribute);

        $races = Race::orderByRaw("CASE
        WHEN junior_flag = 1 THEN 1
        WHEN classic_flag = 1 THEN 2
        WHEN senior_flag = 1 THEN 3
        ELSE 4 END")
        ->orderBy('race_months', 'asc') 
        ->orderBy('half_flag', 'asc')
        ->orderBy('race_rank', 'asc')
        ->get();

        $this->umamusumeLoger->logwrite(msg: 'end',attribute: $this->logAttribute);

        return response()->json(['data' => $races]);
    }

    //ウマ娘を登録する際のレース情報を加工してDBから取得するAPI
    //引数 なし
    //戻り値 JsonResponse
    public function raceRegistList() : JsonResponse
    {
        $this->logAttribute = 'raceRegistList';

        $this->umamusumeLoger->logwrite(msg: 'start',attribute: $this->logAttribute);

        $races = Race::whereIn('race_rank', [1, 2, 3])
        ->orderBy('race_rank', 'asc')
        ->orderBy('race_months', 'asc')
        ->orderBy('half_flag', 'asc')
        ->get();

        $this->umamusumeLoger->logwrite(msg: 'end',attribute: $this->logAttribute);

        return response()->json(['data' => $races]);
    }

    //ユーザーが登録したウマ娘の未出走データを取得するAPI
    //引数 なし
    //戻り値 JsonResponse
    public function remaining() : JsonResponse
    {
        $this->logAttribute = 'remaining';

        $this->umamusumeLoger->logwrite(msg: 'start',attribute: $this->logAttribute);

        $userId = Auth::user()->user_id;
        $registUmamusumeArray = RegistUmamusume::where('user_id', $userId)->with('umamusume')->get();

        $results = array();
        foreach($registUmamusumeArray as $registUmamusume){
            $registUmamusumeRaceArray = RegistUmamusumeRace::where('user_id', $userId)
            ->where('umamusume_id',$registUmamusume->umamusume_id)->pluck('race_id')->toArray();

            $remainingAllRace = Race::whereNotIn('race_id',$registUmamusumeRaceArray)->whereIn('race_rank',[1,2,3])->get();

            $isAllCrown = $remainingAllRace->count() == 0 ? true : false;

            $turfSprintRace = 0;
            $turfMileRace = 0;
            $turfClassicRace = 0;
            $turfLongDistanceRace = 0;
            $dirtSprintDistanceRace = 0;
            $dirtMileRace = 0;
            $dirtClassicRace = 0;

            if(!$isAllCrown){
                $turfSprintRace         = $remainingAllRace->where('race_state',0)->where('distance',1)->count();
                $turfMileRace           = $remainingAllRace->where('race_state',0)->where('distance',2)->count();
                $turfClassicRace        = $remainingAllRace->where('race_state',0)->where('distance',3)->count();
                $turfLongDistanceRace   = $remainingAllRace->where('race_state',0)->where('distance',4)->count();
                $dirtSprintDistanceRace = $remainingAllRace->where('race_state',1)->where('distance',1)->count();
                $dirtMileRace           = $remainingAllRace->where('race_state',1)->where('distance',2)->count();
                $dirtClassicRace        = $remainingAllRace->where('race_state',1)->where('distance',3)->count();
            }
            $result = [
                "umamusume"             => $registUmamusume->umamusume,
                "isAllCrown"            => $isAllCrown,
                "allCrownRace"          => $remainingAllRace->count(),
                "turfSprintRace"        => $turfSprintRace,
                "turfMileRace"          => $turfMileRace,
                "turfClassicRace"       => $turfClassicRace,
                "turfLongDistanceRace"  => $turfLongDistanceRace,
                "dirtSprintDistanceRace"=> $dirtSprintDistanceRace,
                "dirtMileRace"          => $dirtMileRace,
                "dirtClassicRace"       => $dirtClassicRace,
            ];

            $results[] = $result;
        }

        $this->umamusumeLoger->logwrite(msg: 'end',attribute: $this->logAttribute);

        return response()->json(['data' => $results]);
    }

    //シーズン、出走月、前後半
    //また対象ウマ娘が出走していない
    //レースを取得するAPi
    //引数 Request
    //戻り値 JsonResponse
    public function remainingToRace( Request $request) : JsonResponse
    {
        $this->logAttribute = 'remainingToRace';

        $this->umamusumeLoger->logwrite(msg: 'start',attribute: $this->logAttribute);
        
        $userId = Auth::user()->user_id;
        $umamusumeId = $request->json('umamusumeId');
        $season = $request->json('season');
        $month = $request->json('month');
        $half = $request->json('half');

        $props = array();
        $props['season'] = $season;
        $props['month']  = $month;
        $props['half']   = $half;

        $registUmamusumeRaceArray = RegistUmamusumeRace::where('user_id', $userId)
        ->where('umamusume_id',$umamusumeId)->pluck('race_id')->toArray();

        $race = $this->setRemainingRace( registUmamusumeRaceArray: $registUmamusumeRaceArray , season: $season , month: $month , half: $half );

        $loopCount = 0;

        while (is_null(value: $race) && $loopCount < 2) {
            $secondHalf   = $half == 1 ? 0 : 1;
            $secondMonth  = $month;
            $secondSeason = $season;

            if($half){
                $secondMonth = $month + 1;
                if($month == 12){
                    $secondMonth = 1;
                    if($season < 3){
                        $secondSeason = $secondSeason + 1;
                    }
                }
            }

            $props['season'] = $secondSeason;
            $props['month']  = $secondMonth;
            $props['half']   = $secondHalf;

            $race = $this->setRemainingRace( registUmamusumeRaceArray: $registUmamusumeRaceArray , season: $secondSeason , month: $secondMonth , half: $secondHalf );
            
            $loopCount++;
        }

        $props['isRaceReturn'] = $this->setRaceReturn(registUmamusumeRaceArray: $registUmamusumeRaceArray,prop: $props);
        $props['isRaceForward'] = $this->setRaceForward(registUmamusumeRaceArray: $registUmamusumeRaceArray,prop: $props);

        $this->umamusumeLoger->logwrite(msg: 'end',attribute: $this->logAttribute);

        return response()->json(['data' => $race,'Props' => $props]);
    }

    //全体残レース、シーズン、出走月、前後半を引数としてレースを取得する関数
    //引数1 registUmamusumeRaceArray 出走したレースId配列
    //引数2 season 期
    //引数3 month 出走月
    //引数4 half 前後半
    //戻り値 JsonResponse
    private function setRemainingRace( array $registUmamusumeRaceArray, int $season, int $month, int $half) : array
    {
        $this->umamusumeLoger->logwrite(msg: 'start',attribute: 'setRemainingRace');

        $remainingAllRace = Race::whereNotIn('race_id',$registUmamusumeRaceArray)->whereIn('race_rank',[1,2,3]);
        switch($season){
            case 1:
                return $remainingAllRace->where('half_flag',$half)->where('race_months',$month)->where('junior_flag',1)->get();
            case 2:
                return $remainingAllRace->where('half_flag',$half)->where('race_months',$month)->where('classic_flag',1)->get();
            case 3:
                return $remainingAllRace->where('half_flag',$half)->where('race_months',$month)->where('senior_flag',1)->get();
        }
    }

    //対象時期より前にレースが存在するか検証する関数
    //引数1 registUmamusumeRaceArray 出走したレースId配列
    //引数2 prop データを格納した配列
    //戻り値 bool
    private function setRaceReturn( array $registUmamusumeRaceArray, array $prop) : bool
    {
        $this->umamusumeLoger->logwrite(msg: 'start',attribute: 'setRaceReturn');

        $remainingAllRace = Race::whereNotIn('race_id',$registUmamusumeRaceArray)->whereIn('race_rank',[1,2,3])->get();

        $seasonArray = array();

        for($s = $prop['season'] ; 0 < $s ; $s--){
            $seasonArray[] = $s;
        }

        foreach($seasonArray as $season){
            $month = $prop['month'];
            $half =  $prop['half'];
            if($prop['season'] == $season){
                if($half == '1'){
                    switch($season){
                        case 1:
                            if($remainingAllRace->where('half_flag',0)->where('race_months',$month)->where('junior_flag',1)->count() > 0){
                                return true;
                            }
                        break;
                        case 2:
                            if($remainingAllRace->where('half_flag',0)->where('race_months',$month)->where('classic_flag',1)->count() > 0){
                                return true;
                            }
                        break;
                        case 3:
                            if($remainingAllRace->where('half_flag',0)->where('race_months',$month)->where('senior_flag',1)->count() > 0){
                                return true;
                            }
                        break;
                    }
                }
                switch($season){
                    case 1:
                        if($remainingAllRace->where('race_months','<',$month)->where('junior_flag',1)->count() > 0){
                            return true;
                        }
                    break;
                    case 2:
                        if($remainingAllRace->where('race_months','<',$month)->where('classic_flag',1)->count() > 0){
                            return true;
                        }
                    break;
                    case 3:
                        if($remainingAllRace->where('race_months','<',$month)->where('senior_flag',1)->count() > 0){
                            return true;
                        }
                    break;
                }
            }else{
                switch($season){
                    case 1:
                        if($remainingAllRace->where('junior_flag',1)->count() > 0){
                            return true;
                        }
                    break;
                    case 2:
                        if($remainingAllRace->where('classic_flag',1)->count() > 0){
                            return true;
                        }
                    break;
                }
            }
        }
        return false;
    }

    //対象時期より後にレースが存在するか検証する関数
    //引数1 registUmamusumeRaceArray 出走したレースId配列 
    //引数2 prop データを格納した配列
    //戻り値 bool
    private function setRaceForward( array $registUmamusumeRaceArray, array $prop ) : bool
    {
        $this->umamusumeLoger->logwrite(msg: 'start',attribute: 'setRaceForward');

        $remainingAllRace = Race::whereNotIn('race_id',$registUmamusumeRaceArray)->whereIn('race_rank',[1,2,3])->get();

        $seasonArray = array();

        for($s = $prop['season'] ; $s < 4 ; $s++){
            $seasonArray[] = $s;
        }

        foreach($seasonArray as $season){
            $month = $prop['month'];
            $half =  $prop['half'];
            if($prop['season'] == $season){
                if($half == '0'){
                    switch($season){
                        case 1:
                            if($remainingAllRace->where('half_flag',1)->where('race_months',$month)->where('junior_flag',1)->count() > 0){
                                return true;
                            }
                        break;
                        case 2:
                            if($remainingAllRace->where('half_flag',1)->where('race_months',$month)->where('classic_flag',1)->count() > 0){
                                return true;
                            }
                        break;
                        case 3:
                            if($remainingAllRace->where('half_flag',1)->where('race_months',$month)->where('senior_flag',1)->count() > 0){
                                return true;
                            }
                        break;
                    }
                }
                switch($season){
                    case 1:
                        if($remainingAllRace->where('race_months','>',$month)->where('junior_flag',1)->count() > 0){
                            return true;
                        }
                    break;
                    case 2:
                        if($remainingAllRace->where('race_months','>',$month)->where('classic_flag',1)->count() > 0){
                            return true;
                        }
                    break;
                    case 3:
                        if($remainingAllRace->where('race_months','>',$month)->where('senior_flag',1)->count() > 0){
                            return true;
                        }
                    break;
                }
            }else{
                switch($season){
                    case 2:
                        if($remainingAllRace->where('classic_flag',1)->count() > 0){
                            return true;
                        }
                    break;
                    case 3:
                        if($remainingAllRace->where('senior_flag',1)->count() > 0){
                            return true;
                        }
                    break;
                }
            }
        }
        return false;
    }

    //対象のレースに対して出走した結果を残すAPI
    //引数 Request
    //戻り値 JsonResponse
    public function raceRun ( Request $request) : JsonResponse
    {
        $this->logAttribute = 'raceRun';

        $this->umamusumeLoger->logwrite(msg: 'start',attribute: $this->logAttribute);
        
        $userId = Auth::user()->user_id;
        $umamusumeId = $request->json('umamusumeId');
        $raceId = $request->json('raceId');
        try{
            $registUmamusumeRace = new RegistUmamusumeRace();
            $registUmamusumeRace->user_id = $userId;
            $registUmamusumeRace->umamusume_id = $umamusumeId;
            $registUmamusumeRace->race_id = $raceId;
            $registUmamusumeRace->regist_date = Carbon::now();
            $registUmamusumeRace->save();
        }catch (\Exception $e) {
            Log::error('ウマ娘出走エラー:', $e->getMessage());
            return response()->json(['error' => 'ウマ娘出走エラー'], 500);
        }

        $this->umamusumeLoger->logwrite(msg: 'end',attribute: $this->logAttribute);

        return response()->json([
            'message' => '出走完了'
        ], 201);
    }

    //対象ウマ娘の残レースと適性に合わせて推奨される因子とシナリオを取得するAPI
    //引数 Request
    //戻り値 JsonResponse
    public function remainingPattern( Request $request) : JsonResponse
    {
        $this->logAttribute = 'remainingPattern';

        $this->umamusumeLoger->logwrite(msg: 'start',attribute: $this->logAttribute);

        //一連の処理
        $userId = Auth::user()->user_id;

        $umamusumeId = $request->json('umamusumeId');

        if(is_null($umamusumeId)){
            $this->umamusumeLoger->logwrite(msg: 'end',attribute: $this->logAttribute);
            return response()->json(['error' => 'ウマ娘出走エラー'], 500);
        }

        $this->selectUmamusume = Umamusume::where('umamusume_id',$umamusumeId)->first();

        $registUmamusumeRaceArray = RegistUmamusumeRace::where('user_id', $userId)
        ->where('umamusume_id',$umamusumeId)->pluck('race_id')->toArray();

        $remainingAllRaceCollections = Race::whereNotIn('race_id',$registUmamusumeRaceArray)->whereIn('race_rank',[1,2,3])->get();

        //一連の処理

        //まずシナリオレースの時期と重複するレースの存在の検証
        //TRUEであれば固有シナリオが存在するレースでは難しい………A
        $IsExistScenarioFlag = $this->checkDuplicateScenarioRace(umamusumeId: $umamusumeId ,remainingAllRaceCollections: $remainingAllRaceCollections);

        //次にラークシナリオのレースの時期と重複するレースの存在の検証
        //TRUEであればラークシナリオである必要がない………B
        $IsExistLarcFlag = $this->checkLarcScenario(remainingAllRaceCollections: $remainingAllRaceCollections);

        $result = array();

        //AがTRUEならメイクラ
        //FALSEでBがTRUEならLarc
        //FALSEならなんでもいい
        if($IsExistScenarioFlag){
            $result['selectScenario'] = 'メイクラ';
        }else{
            if($IsExistLarcFlag){
                $result['selectScenario'] = 'なんでも';
            }else{
                $result['selectScenario'] = 'Larc';
            }
        }

        $result['requiredsFactor'] = $this->getRequiredsFactor(remainingAllRaceCollections: $remainingAllRaceCollections);

        $this->umamusumeLoger->logwrite(msg: 'end',attribute: $this->logAttribute);

        return response()->json(['data' => $result]);
    }

    //残レースに対象ウマ娘のシナリオと被るレースが存在するか検証する関数
    //引数 umamusumeId 対象ウマ娘Id
    //引数 remainingAllRaceCollections 残レース配列
    //戻り値 bool
    private function checkDuplicateScenarioRace( int $umamusumeId, object $remainingAllRaceCollections) : bool
    {
        $this->umamusumeLoger->logwrite(msg: 'start',attribute: 'checkDuplicateScenarioRace');

        $result = false;

        $scenarioRaceArray = ScenarioRace::where('umamusume_id', $umamusumeId)->get();

        foreach($scenarioRaceArray as $scenarioRaceItem){

            $checkRace = Race::where('race_id',$scenarioRaceItem['race_id'])->first();

            $seniorFlag = $classicFlag = $juniorFlag = null;
            
            if(is_null($scenarioRaceItem['senior_flag'])){
                $seniorFlag  = $checkRace->senior_flag  ? $checkRace->senior_flag  : 'all';
                $classicFlag = $checkRace->classic_flag ? $checkRace->classic_flag : 'all';
                $juniorFlag  = $checkRace->junior_flag  ? $checkRace->junior_flag  : 'all';
            }else{
                if($scenarioRaceItem['senior_flag']){
                    $seniorFlag  = $checkRace->senior_flag  ? $checkRace->senior_flag  : 'all';
                    $classicFlag = 'all';
                    $juniorFlag  = $checkRace->junior_flag  ? $checkRace->junior_flag  : 'all';
                }else{
                    $seniorFlag  = 'all';
                    $classicFlag = $checkRace->classic_flag ? $checkRace->classic_flag : 'all';
                    $juniorFlag  = $checkRace->junior_flag  ? $checkRace->junior_flag  : 'all';
                }
            }

            $conditions = [];
            
            if ($classicFlag !== 'all') {
                $conditions['classic_flag'] = $classicFlag;
            }
            if ($seniorFlag !== 'all') {
                $conditions['senior_flag'] = $seniorFlag;
            }
            if ($juniorFlag !== 'all') {
                $conditions['junior_flag'] = $juniorFlag;
            }

            $conditions['race_months'] = $checkRace['race_months'];
            $conditions['half_flag'] = $checkRace['half_flag'];
            $conditions['race_name'] = $checkRace['race_name'];

            $result = $remainingAllRaceCollections->contains(function ( $item) use ( $conditions, $checkRace) : bool 
            {
                foreach ($conditions as $key => $value) {
                    if ($item['race_name'] === $checkRace['race_name']) {
                        return false;
                    }
                    if ($item[$key] !== $value) {
                        return false;
                    }
                }
                return true;
            });
            if($result){
                return $result;
            }
        }
        return $result;
    }

    //残レースのレースをバ場と距離に分割してランク付けする関数
    //引数 remainingAllRaceCollections 残レース配列
    //戻り値 array
    private function getRankedRaceCounts( object $remainingAllRaceCollections) : array
    {
        $this->umamusumeLoger->logwrite(msg: 'start',attribute: 'getRankedRaceCounts');

        $raceCounts = [
            '芝_短距離'        => ($remainingAllRaceCollections)->where('race_state', 0)->where('distance', 1)->count(),
            '芝_マイル'        => ($remainingAllRaceCollections)->where('race_state', 0)->where('distance', 2)->count(),
            '芝_中距離'        => ($remainingAllRaceCollections)->where('race_state', 0)->where('distance', 3)->count(),
            '芝_長距離'        => ($remainingAllRaceCollections)->where('race_state', 0)->where('distance', 4)->count(),
            'ダート_短距離'     => ($remainingAllRaceCollections)->where('race_state', 1)->where('distance', 1)->count(),
            'ダート_マイル'     => ($remainingAllRaceCollections)->where('race_state', 1)->where('distance', 2)->count(),
            'ダート_中距離'     => ($remainingAllRaceCollections)->where('race_state', 1)->where('distance', 3)->count(),
        ];

        arsort(array: $raceCounts);

        $rankedRaceCounts = [];
        $rank = 1;

        foreach ($raceCounts as $key => $count) {
            list($raceType, $distance) = explode(separator: '_', string: $key);
    
            $rankedRaceCounts[] = [
                'race_type' => $raceType,
                'distance'  => $distance,
                'count'     => $count,
                'rank'      => $rank,
            ];
    
            $rank++;
        }
    

        return $rankedRaceCounts;
    }

    //対象の適性を引き上げるために必要な因子を計算する関数
    //引数1 aptitude 適性ランク
    //引数2 aptitudeType 適性名 
    //引数3 array 因子格納配列
    //戻り値 array
    private function setRequiredsFactor( string $aptitude, string $aptitudeType, array $array) : array
    {
        $this->umamusumeLoger->logwrite(msg: 'start',attribute: 'setRequiredsFactor');

        switch($aptitude){
            case 'E':
                if(count(value: $array) == 6){
                    break;
                }
                $array[] = $aptitudeType;
            break;
            case 'F':
                for($facter = 0 ; $facter < 2 ; $facter++){
                    if(count(value: $array) == 6){
                        break;
                    }
                    $array[] = $aptitudeType;
                }
            break;
            case 'G':
                for($facter = 0 ; $facter < 3 ; $facter++){
                    if(count(value: $array) == 6){
                        break;
                    }
                    $array[] = $aptitudeType;
                }
            break;
            default:
            break;
        }
        return $array;
    }

    //残レースでラークシナリオを走るべきレースがあるか検証する関数
    //引数 remainingAllRaceCollections 残レース配列
    //戻り値 bool
    private function checkLarcScenario( object $remainingAllRaceCollections) : bool
    {
        $this->umamusumeLoger->logwrite(msg: 'start',attribute: 'checkLarcScenario');

        if($remainingAllRaceCollections->where("scenario_flag",1)->count() == 0){
            //以下条件に当てはまれば
            //日本ダービー条件
            if($remainingAllRaceCollections->whereNotIn("race_name","日本ダービー")->where("half_flag",1)->where("race_months",5)->count() > 0){
                return true;
            }
            //夏合宿条件
            if($remainingAllRaceCollections->whereNotIn("race_name",["ニエル賞","フォワ賞"])->whereIn("race_months",[7,8,9])->where("classic_flag",0)->count() > 0){
                return true;
            }
            //凱旋門賞条件
            if($remainingAllRaceCollections->whereNotIn("race_name","凱旋門賞")->where("race_months",10)->where("half_flag",0)->count() > 0){
                return true;
            }
            //宝塚記念条件
            if($remainingAllRaceCollections->whereNotIn("race_name","宝塚記念")->where("race_months",10)->where("half_flag",0)
            ->where("senior_flag",1)->where("classic_flag",0)->where("junior_flag",0)->count() > 0){
                return true;
            }
        }
        return false;
    }

    //残レースから必要な因子情報を格納する関数
    //引数 remainingAllRaceCollections 残レース配列
    //戻り値 array
    private function getRequiredsFactor( object $remainingAllRaceCollections) : array
    {
        $this->umamusumeLoger->logwrite(msg: 'start',attribute: 'getRequiredsFactor');

        $rankRace = $this->getRankedRaceCounts(remainingAllRaceCollections: $remainingAllRaceCollections);

        $requiredsFactor = array();

        for($i = 0 ; $i < 7 ; $i++){
            if($rankRace[$i]['race_type'] == '芝'){
                $requiredsFactor = $this->setRequiredsFactor(aptitude: $this->selectUmamusume->turf_aptitude,aptitudeType: $rankRace[$i]['race_type'],array: $requiredsFactor);
            }else{
                $requiredsFactor = $this->setRequiredsFactor(aptitude: $this->selectUmamusume->dirt_aptitude,aptitudeType: $rankRace[$i]['race_type'],array: $requiredsFactor);
            }
            if(count(value: $requiredsFactor) == 6){
                break;
            }
    
            switch($rankRace[$i]['distance']){
                case '短距離':
                    $requiredsFactor = $this->setRequiredsFactor(aptitude: $this->selectUmamusume->sprint_aptitude,aptitudeType: $rankRace[$i]['distance'],array: $requiredsFactor);
                break;
                case 'マイル':
                    $requiredsFactor = $this->setRequiredsFactor(aptitude: $this->selectUmamusume->mile_aptitude,aptitudeType: $rankRace[$i]['distance'],array: $requiredsFactor);
                break;
                case '中距離':
                    $requiredsFactor = $this->setRequiredsFactor(aptitude: $this->selectUmamusume->classic_aptitude,aptitudeType: $rankRace[$i]['distance'],array: $requiredsFactor);
                break;
                case '長距離':
                    $requiredsFactor = $this->setRequiredsFactor(aptitude: $this->selectUmamusume->long_distance_aptitude,aptitudeType: $rankRace[$i]['distance'],array: $requiredsFactor);
                break;
            }
            if(count(value: $requiredsFactor) == 6){
                break;
            }
        }
        sort(array: $requiredsFactor); 
        return $requiredsFactor;
    }
}