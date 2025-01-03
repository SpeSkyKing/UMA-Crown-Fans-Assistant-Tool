<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Live;
use App\Models\VocalUmamusume;

class LiveController extends Controller
{
    public function liveList(){
        $liveList = Live::all();
        return response()->json(['data' => $liveList]);
    }

    public function umamusumeList(Request $request){
        $liveId = $request->json('liveId');
        $umamusumes = VocalUmamusume::where('live_id',$liveId)->get();
        return response()->json(['data' => $umamusumes->pluck('Umamusume')]);
    }
}
