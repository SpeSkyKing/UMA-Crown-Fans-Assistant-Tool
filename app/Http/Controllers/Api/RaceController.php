<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Race;
use App\Models\RegistUmamusume;
use App\Models\RegistUmamusumeRace;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class RaceController extends Controller
{
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
        $races = Race::orderByRaw("CASE
        WHEN junior_flag = 1 THEN 1
        WHEN classic_flag = 1 THEN 2
        WHEN senior_flag = 1 THEN 3
        ELSE 4 END")
        ->orderBy('race_months', 'asc') 
        ->orderBy('half_flag', 'asc')
        ->orderBy('race_rank', 'asc')
        ->whereIn('race_rank',[1,2,3])
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
            $dirtMileRace = 0;
            $dirtClassicRace = 0;
            $dirtLongDistanceRace = 0;

            if(!$isAllCrown){
                $turfSprintRace         = (clone $remainingAllRace)->where('race_state',0)->where('distance',1)->count();
                $turfMileRace           = (clone $remainingAllRace)->where('race_state',0)->where('distance',2)->count();
                $turfClassicRace        = (clone $remainingAllRace)->where('race_state',0)->where('distance',3)->count();
                $turfLongDistanceRace   = (clone $remainingAllRace)->where('race_state',0)->where('distance',4)->count();
                $dirtMileRace           = (clone $remainingAllRace)->where('race_state',1)->where('distance',1)->count();
                $dirtClassicRace        = (clone $remainingAllRace)->where('race_state',1)->where('distance',2)->count();
                $dirtLongDistanceRace   = (clone $remainingAllRace)->where('race_state',1)->where('distance',3)->count();
            }
            $result = [
                "umamusume"             => $registUmamusume->umamusume,
                "isAllCrown"            => $isAllCrown,
                "allCrownRace"          => $remainingAllRace->count(),
                "turfSprintRace"        => $turfSprintRace,
                "turfMileRace"          => $turfMileRace,
                "turfClassicRace"       => $turfClassicRace,
                "turfLongDistanceRace"  => $turfLongDistanceRace,
                "dirtMileRace"          => $dirtMileRace,
                "dirtClassicRace"       => $dirtClassicRace,
                "dirtLongDistanceRace"  => $dirtLongDistanceRace,
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

        $registUmamusumeRaceArray = RegistUmamusumeRace::where('user_id', $userId)
        ->where('umamusume_id',$umamusumeId)->pluck('race_id')->toArray();

        $remainingAllRace = Race::whereNotIn('race_id',$registUmamusumeRaceArray)->whereIn('race_rank',[1,2,3]);

        switch($season){
            case 1:
                $race = $remainingAllRace->where('half_flag',$half)->where('race_months',$month)->where('junior_flag',1)->get();
            break;
            case 2:
                $race = $remainingAllRace->where('half_flag',$half)->where('race_months',$month)->where('classic_flag',1)->get();
            break;
            case 3:
                $race = $remainingAllRace->where('half_flag',$half)->where('race_months',$month)->where('senior_flag',1)->get();
            break;
        }
        return response()->json(['data' => $race]);
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
}