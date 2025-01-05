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

        $results = array();

        $registUmamusumeRaceArray = RegistUmamusumeRace::where('user_id', $userId)
        ->where('umamusume_id',$umamusumeId)->pluck('race_id')->toArray();

        $scenarioRaceArray = ScenarioRace::where('umamusume_id', $umamusumeId)->pluck('race_id')->toArray();

        $scenarioRaceTimes = ScenarioRace::whereIn('race_id', $scenarioRaceArray)
            ->select('race_id','senior_flag','classic_flag','junior_flag','race_months','half_flag')
            ->distinct()
            ->get();

        $matchingRaceIds = $scenarioRaceTimes->flatMap(function ($time) use ($remainingAllRace) {
            return $remainingAllRace->filter(function ($race) use ($time) {
                return $race->race_months == $time->race_months && $race->half_flag == $time->half_flag
                && $race->classic_flag == $time->classic_flag  && $race->junior_flag == $time->junior_flag
                && $race->senior_flag == $time->senior_flag;
            })->pluck('race_id');
        })->unique()->values();
        

        $remainingAllRace = Race::whereNotIn('race_id',$registUmamusumeRaceArray)->whereIn('race_rank',[1,2,3]);

        $remainingAllRaceData = (clone $remainingAllRace)->get();

        //

        if(!(clone $remainingAllRace)->where('scenario_flag',1)->doesntExist()){
            $selectScenario = 'Lark';
        }

        if(collect($remainingAllRaceData)->pluck('race_id')->intersect($scenarioRaceArray)->isNotEmpty()){
            
        }



        $raceCounts = [
            '芝_短距離'        => (clone $remainingAllRace)->where('race_state',0)->where('distance',1)->count(),
            '芝_マイル'        => (clone $remainingAllRace)->where('race_state',0)->where('distance',2)->count(),
            '芝_中距離'        => (clone $remainingAllRace)->where('race_state',0)->where('distance',3)->count(),
            '芝_長距離'        => (clone $remainingAllRace)->where('race_state',0)->where('distance',4)->count(),
            'ダート_短距離'     => (clone $remainingAllRace)->where('race_state',1)->where('distance',1)->count(),
            'ダート_マイル'     => (clone $remainingAllRace)->where('race_state',1)->where('distance',2)->count(),
            'ダート_中距離'     => (clone $remainingAllRace)->where('race_state',1)->where('distance',3)->count(),
        ];

        $maxRaceCount = max($raceCounts);

        $maxRaceKey = array_search($maxRaceCount, $raceCounts);

        list($maxRaceType, $maxDistance) = explode('_', $maxRaceKey);

        $this->selectUmamusume = Umamusume::where('umamusume_id',$umamusumeId)->first();

        $requiredsFactor = array();
        if($maxRaceType == '芝'){
            $this->setRequiredsFactor($this->selectUmamusume->turf_aptitude,$maxRaceType,'turf_aptitude',$requiredsFactor);
        }else{
            $this->setRequiredsFactor($this->selectUmamusume->dirt_aptitude,$maxRaceType,'dirt_aptitude',$requiredsFactor);
        }

        switch($maxDistance){
            case '短距離':
                $this->setRequiredsFactor($this->selectUmamusume->sprint_aptitude,$maxDistance,'sprint_aptitude',$requiredsFactor);
            break;
            case 'マイル':
                $this->setRequiredsFactor($this->selectUmamusume->mile_aptitude,$maxDistance,'mile_aptitude',$requiredsFactor);
            break;
            case '中距離':
                $this->setRequiredsFactor($this->selectUmamusume->classic_aptitude,$maxDistance,'classic_aptitude',$requiredsFactor);
            break;
            case '長距離':
                $this->setRequiredsFactor($this->selectUmamusume->long_distance_aptitude,$maxDistance,'long_distance_aptitude',$requiredsFactor);
            break;
        }

        $racePriority = $this->setRacePriority($this->selectUmamusume);

        $races = array();

        for($season = 1 ; $season < 4 ; $season++){
            for($month = 1 ; $month < 13 ; $month++){
                for($half = 0 ; $half < 2 ; $half++){
                    if($season == 1 && $month < 7 ){
                        if($month == 7 && $half == 0){
                            continue;
                        }
                    }else{
                        $race = null;
                        for($priority = 0 ; $priority < 7 ; $priority++){
                            if(!is_null($race)){
                                break;
                            }
                            $raceKey = $racePriority[$priority];
                            list($state, $distance) = explode('_', $raceKey);
                            switch($season){
                                case 1:
                                    $race = (clone $remainingAllRace)->where('half_flag',$half)->where('race_months',$month)->where('junior_flag',1)
                                    ->where('race_state',(int)$state)->where('distance',(int)$distance)->first();
                                break;
                                case 2:
                                    $race = (clone $remainingAllRace)->where('half_flag',$half)->where('race_months',$month)->where('classic_flag',1)
                                    ->where('race_state',(int)$state)->where('distance',(int)$distance)->first();
                                break;
                                case 3:
                                    $race = (clone $remainingAllRace)->where('half_flag',$half)->where('race_months',$month)->where('senior_flag',1)
                                    ->where('race_state',(int)$state)->where('distance',(int)$distance)->first();
                                break;
                            }
                        }
                        $races[] = $race;
                    }
                }
            }
        }

        $result = [
            'race' => $races,
            'requiredsFactor' => $requiredsFactor
        ];

        //
        $results[] = $result;

        return response()->json(['data' => $results]);
    }

    private function setRequiredsFactor(string $aptitude,string $aptitudeType,string $aptitudeDBName,array $array){
        switch($aptitude){
            case 'E':
                $array[] = $aptitudeType;
            break;
            case 'F':
                $array[] = $aptitudeType;
                $array[] = $aptitudeType;
            break;
            case 'G':
                $array[] = $aptitudeType;
                $array[] = $aptitudeType;
                $array[] = $aptitudeType;
            break;
            default:
            break;
        }
        $this->selectUmamusume->$aptitudeDBName = 'D';
        return $array;
    }

    private function setRacePriority(Umamusume $umamusume)
    {
        $aptitudeScores = [
            'A' => 7, 'B' => 6, 'C' => 5,
            'D' => 4, 'E' => 3, 'F' => 2, 'G' => 1
        ];

        $categories = [
            '0_1' => $aptitudeScores[$umamusume->turf_aptitude] + $aptitudeScores[$umamusume->sprint_aptitude],
            '0_2' => $aptitudeScores[$umamusume->turf_aptitude] + $aptitudeScores[$umamusume->mile_aptitude],
            '0_3' => $aptitudeScores[$umamusume->turf_aptitude] + $aptitudeScores[$umamusume->classic_aptitude],
            '0_4' => $aptitudeScores[$umamusume->turf_aptitude] + $aptitudeScores[$umamusume->long_distance_aptitude],
            '1_1' => $aptitudeScores[$umamusume->dirt_aptitude] + $aptitudeScores[$umamusume->sprint_aptitude],
            '1_2' => $aptitudeScores[$umamusume->dirt_aptitude] + $aptitudeScores[$umamusume->mile_aptitude],
            '1_3' => $aptitudeScores[$umamusume->dirt_aptitude] + $aptitudeScores[$umamusume->classic_aptitude],
        ];

        arsort($categories);

        $priority = array_keys($categories);
        return $priority;
    }
}