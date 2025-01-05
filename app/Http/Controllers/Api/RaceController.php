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

class RaceController extends Controller
{
    private Umamusume $selectUmamusume;

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

    public function raceRegistList()
    {
        $races = Race::whereIn('race_rank', [1, 2, 3])
        ->orderBy('race_rank', 'asc')
        ->orderBy('race_months', 'asc')
        ->orderBy('half_flag', 'asc')
        ->get();

        return response()->json(['data' => $races]);
    }

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

    public function remainingPattern(Request $request){
        
        $userId = Auth::user()->user_id;

        $umamusumeId = $request->json('umamusumeId');

        $this->selectUmamusume = Umamusume::where('umamusume_id',$umamusumeId)->first();

        $registUmamusumeRaceArray = RegistUmamusumeRace::where('user_id', $userId)
        ->where('umamusume_id',$umamusumeId)->pluck('race_id')->toArray();

        $remainingAllRace = Race::whereNotIn('race_id',$registUmamusumeRaceArray)->whereIn('race_rank',[1,2,3]);

        $remainingAllRaceCollections = (clone $remainingAllRace)->get();
        $rankRace = $this->getRankedRaceCounts(clone $remainingAllRace);

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

        $result= array();

        $result['requiredsFactor'] = $requiredsFactor;

        $scenarioRaceArray = ScenarioRace::where('umamusume_id', $umamusumeId)->pluck('race_id')->toArray();

        $scenarioRaceTimes = Race::whereIn('race_id', $scenarioRaceArray)
        ->select('race_id', 'senior_flag', 'classic_flag', 'junior_flag', 'race_months', 'half_flag')
        ->distinct()
        ->get();

        $scenarioMatchingRaceIds = $scenarioRaceTimes->flatMap(function ($time) use ($remainingAllRaceCollections) {
            return $remainingAllRaceCollections->filter(function ($race) use ($time) {
                return $race->race_months == $time->race_months && $race->half_flag == $time->half_flag
                && $race->classic_flag == $time->classic_flag  && ($race->junior_flag == $time->junior_flag
                || $race->senior_flag == $time->senior_flag);
            })->pluck('race_id');
        })->unique()->values();

        if(!is_null($scenarioMatchingRaceIds)){
            if($this->checkLarc(clone $remainingAllRace)){
                $result['selectScenario'] = 'Larc';
            }else{
                $result['selectScenario'] = 'メイクラ';
            }
            return response()->json(['data' => $result]);
        }
    }

    private function getRankedRaceCounts($remainingAllRace)
    {
        $raceCounts = [
            '芝_短距離'        => (clone $remainingAllRace)->where('race_state', 0)->where('distance', 1)->count(),
            '芝_マイル'        => (clone $remainingAllRace)->where('race_state', 0)->where('distance', 2)->count(),
            '芝_中距離'        => (clone $remainingAllRace)->where('race_state', 0)->where('distance', 3)->count(),
            '芝_長距離'        => (clone $remainingAllRace)->where('race_state', 0)->where('distance', 4)->count(),
            'ダート_短距離'    => (clone $remainingAllRace)->where('race_state', 1)->where('distance', 1)->count(),
            'ダート_マイル'    => (clone $remainingAllRace)->where('race_state', 1)->where('distance', 2)->count(),
            'ダート_中距離'    => (clone $remainingAllRace)->where('race_state', 1)->where('distance', 3)->count(),
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

    private function setRequiredsFactor(string $aptitude,string $aptitudeType,array $array){
        switch($aptitude){
            case 'D':
                if(count($array) == 6){
                    break;
                }
                $array[] = $aptitudeType;
            break;
            case 'E':
                for($e = 0 ; $e < 2 ; $e++){
                    if(count($array) == 6){
                        break;
                    }
                    $array[] = $aptitudeType;
                }
            break;
            case 'F':
                for($f = 0 ; $f < 3 ; $f++){
                    if(count($array) == 6){
                        break;
                    }
                    $array[] = $aptitudeType;
                }
            break;
            case 'G':
                for($g = 0 ; $g < 4 ; $g++){
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

    private function checkLarc($remainingAllRace){
        if(clone $remainingAllRace->where("scenario_flag",1)->get()->count() == 0){
            return false;
        }
        return true;
    }
}