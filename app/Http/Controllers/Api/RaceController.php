<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Race;
use App\Models\RegistUmamusume;
use App\Models\RegistUmamusumeRace;
use App\Models\Umamusume;
use App\Models\ScenarioRace;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

//レース関連のデータを取得するコントローラー
class RaceController extends Controller
{
    //ユーザーが選択したウマ娘のオブジェクトを格納する変数
    private Umamusume $selectUmamusume;

    //レースのリストをDBから取得するAPI
    public function raceList()
    {
        $races = Race::orderByRaw("CASE
        WHEN junior_flag = 1 THEN 1
        WHEN classic_flag = 1 THEN 2
        WHEN senior_flag = 1 THEN 3
        ELSE 4 END")
        ->orderBy('race_months', 'asc') 
        ->orderBy('half_flag', 'asc')
        ->orderBy('race_rank', 'asc')
        ->get();

        return response()->json(['data' => $races]);
    }

    //ウマ娘を登録する際のレース情報を加工してDBから取得するAPI
    public function raceRegistList()
    {
        $races = Race::whereIn('race_rank', [1, 2, 3])
        ->orderBy('race_rank', 'asc')
        ->orderBy('race_months', 'asc')
        ->orderBy('half_flag', 'asc')
        ->get();

        return response()->json(['data' => $races]);
    }

    //ユーザーが登録したウマ娘の未出走データを取得するAPI
    public function remaining(){
        $userId = Auth::user()->user_id;
        $registUmamusumeArray = RegistUmamusume::where('user_id', $userId)->with('umamusume')->get();

        $results = array();
        foreach($registUmamusumeArray as $registUmamusume){
            $registUmamusumeRaceArray = RegistUmamusumeRace::where('user_id', $userId)
            ->where('umamusume_id',$registUmamusume->umamusume_id)->pluck('race_id')->toArray();

            $remainingAllRace = Race::whereNotIn('race_id',$registUmamusumeRaceArray)->whereIn('race_rank',[1,2,3]);

            $isAllCrown = $remainingAllRace->doesntExist() ? true : false;

            $turfSprintRace = 0;
            $turfMileRace = 0;
            $turfClassicRace = 0;
            $turfLongDistanceRace = 0;
            $dirtSprintDistanceRace = 0;
            $dirtMileRace = 0;
            $dirtClassicRace = 0;

            if(!$isAllCrown){
                $turfSprintRace         = (clone $remainingAllRace)->where('race_state',0)->where('distance',1)->count();
                $turfMileRace           = (clone $remainingAllRace)->where('race_state',0)->where('distance',2)->count();
                $turfClassicRace        = (clone $remainingAllRace)->where('race_state',0)->where('distance',3)->count();
                $turfLongDistanceRace   = (clone $remainingAllRace)->where('race_state',0)->where('distance',4)->count();
                $dirtSprintDistanceRace = (clone $remainingAllRace)->where('race_state',1)->where('distance',1)->count();
                $dirtMileRace           = (clone $remainingAllRace)->where('race_state',1)->where('distance',2)->count();
                $dirtClassicRace        = (clone $remainingAllRace)->where('race_state',1)->where('distance',3)->count();
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
        return response()->json(['data' => $results]);
    }

    //シーズン、出走月、前後半
    //また対象うウマ娘が出走していない
    //レースを取得するAPi
    public function remainingToRace(Request $request){
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

        $race = $this->setRemainingRace($registUmamusumeRaceArray,$season,$month,$half);

        if($season == 3 && $month == 12 && $half == 1){
            return response()->json(['data' => $race,'Props' => $props]);
        }

        $loopCount = 0;

        while ($race->isEmpty() && $loopCount < 2) {
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

            $race = $this->setRemainingRace($registUmamusumeRaceArray, $secondSeason, $secondMonth, $secondHalf);
            
            $loopCount++;
        }

        return response()->json(['data' => $race,'Props' => $props]);
    }

    //全体残レース、シーズン、出走月、前後半を引数としてレースを取得する関数
    private function setRemainingRace(array $registUmamusumeRaceArray,int $season,int $month,int $half){
        $remainingAllRace = Race::whereNotIn('race_id',$registUmamusumeRaceArray)->whereIn('race_rank',[1,2,3]);
        switch($season){
            case 1:
                return $remainingAllRace->where('half_flag',$half)->where('race_months',$month)->where('junior_flag',1)->get();
            break;
            case 2:
                return $remainingAllRace->where('half_flag',$half)->where('race_months',$month)->where('classic_flag',1)->get();
            break;
            case 3:
                return $remainingAllRace->where('half_flag',$half)->where('race_months',$month)->where('senior_flag',1)->get();
            break;
        }
    }

    //対象のレースに対して出走した結果を残すAPI
    public function raceRun (Request $request){
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

        return response()->json([
            'message' => '出走完了'
        ], 201);
    }

    //対象ウマ娘の残レースと適性に合わせて推奨される因子とシナリオを取得するAPI
    public function remainingPattern(Request $request){
        
        //一連の処理
        $userId = Auth::user()->user_id;

        $umamusumeId = $request->json('umamusumeId');

        if(is_null($umamusumeId)){
            return response()->json(['error' => 'ウマ娘出走エラー'], 500);
        }

        $this->selectUmamusume = Umamusume::where('umamusume_id',$umamusumeId)->first();

        $registUmamusumeRaceArray = RegistUmamusumeRace::where('user_id', $userId)
        ->where('umamusume_id',$umamusumeId)->pluck('race_id')->toArray();

        $remainingAllRaceCollections = Race::whereNotIn('race_id',$registUmamusumeRaceArray)->whereIn('race_rank',[1,2,3])->get();

        //一連の処理

        //まずシナリオレースの時期と重複するレースの存在の検証
        //TRUEであれば固有シナリオが存在するレースでは難しい………A
        $IsExistScenarioFlag = $this->checkDuplicateScenarioRace($umamusumeId ,$remainingAllRaceCollections);

        //次にラークシナリオのレースの時期と重複するレースの存在の検証
        //TRUEであればラークシナリオである必要がない………B
        $IsExistLarcFlag = $this->checkLarcScenario($remainingAllRaceCollections);

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

        $result['requiredsFactor'] = $this->getRequiredsFactor($remainingAllRaceCollections);

        return response()->json(['data' => $result]);
    }

    //残レースに対象ウマ娘のシナリオと被るレースが存在するか検証する関数
    private function checkDuplicateScenarioRace(int $umamusumeId ,object $remainingAllRaceCollections){
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

            $result = $remainingAllRaceCollections->contains(function ($item) use ($conditions,$checkRace) {
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
    private function getRankedRaceCounts(object $remainingAllRaceCollections)
    {
        $raceCounts = [
            '芝_短距離'        => ($remainingAllRaceCollections)->where('race_state', 0)->where('distance', 1)->count(),
            '芝_マイル'        => ($remainingAllRaceCollections)->where('race_state', 0)->where('distance', 2)->count(),
            '芝_中距離'        => ($remainingAllRaceCollections)->where('race_state', 0)->where('distance', 3)->count(),
            '芝_長距離'        => ($remainingAllRaceCollections)->where('race_state', 0)->where('distance', 4)->count(),
            'ダート_短距離'     => ($remainingAllRaceCollections)->where('race_state', 1)->where('distance', 1)->count(),
            'ダート_マイル'     => ($remainingAllRaceCollections)->where('race_state', 1)->where('distance', 2)->count(),
            'ダート_中距離'     => ($remainingAllRaceCollections)->where('race_state', 1)->where('distance', 3)->count(),
        ];

        arsort($raceCounts);

        $rankedRaceCounts = [];
        $rank = 1;

        foreach ($raceCounts as $key => $count) {
            list($raceType, $distance) = explode('_', $key);
    
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
    private function setRequiredsFactor(string $aptitude,string $aptitudeType,array $array){
        switch($aptitude){
            case 'E':
                if(count($array) == 6){
                    break;
                }
                $array[] = $aptitudeType;
            break;
            case 'F':
                for($facter = 0 ; $facter < 2 ; $facter++){
                    if(count($array) == 6){
                        break;
                    }
                    $array[] = $aptitudeType;
                }
            break;
            case 'G':
                for($facter = 0 ; $facter < 3 ; $facter++){
                    if(count($array) == 6){
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
    private function checkLarcScenario(object $remainingAllRaceCollections){
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
    private function getRequiredsFactor(object $remainingAllRaceCollections){
        $rankRace = $this->getRankedRaceCounts($remainingAllRaceCollections);

        $requiredsFactor = array();

        for($i = 0 ; $i < 7 ; $i++){
            if($rankRace[$i]['race_type'] == '芝'){
                $requiredsFactor = $this->setRequiredsFactor($this->selectUmamusume->turf_aptitude,$rankRace[$i]['race_type'],$requiredsFactor);
            }else{
                $requiredsFactor = $this->setRequiredsFactor($this->selectUmamusume->dirt_aptitude,$rankRace[$i]['race_type'],$requiredsFactor);
            }
            if(count($requiredsFactor) == 6){
                break;
            }
    
            switch($rankRace[$i]['distance']){
                case '短距離':
                    $requiredsFactor = $this->setRequiredsFactor($this->selectUmamusume->sprint_aptitude,$rankRace[$i]['distance'],$requiredsFactor);
                break;
                case 'マイル':
                    $requiredsFactor = $this->setRequiredsFactor($this->selectUmamusume->mile_aptitude,$rankRace[$i]['distance'],$requiredsFactor);
                break;
                case '中距離':
                    $requiredsFactor = $this->setRequiredsFactor($this->selectUmamusume->classic_aptitude,$rankRace[$i]['distance'],$requiredsFactor);
                break;
                case '長距離':
                    $requiredsFactor = $this->setRequiredsFactor($this->selectUmamusume->long_distance_aptitude,$rankRace[$i]['distance'],$requiredsFactor);
                break;
            }
            if(count($requiredsFactor) == 6){
                break;
            }
        }
        sort($requiredsFactor); 
        return $requiredsFactor;
    }
}