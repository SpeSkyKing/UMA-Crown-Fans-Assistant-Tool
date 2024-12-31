<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Live;

class LiveController extends Controller
{
    public function liveList(){
        $liveList = Live::all();
        return response()->json(['data' => $liveList]);
    }
}
