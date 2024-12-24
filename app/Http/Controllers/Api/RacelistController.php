<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Race;

class RacelistController extends Controller
{
    public function index()
    {
        $races = Race::orderBy('race_rank', 'asc')
        ->orderBy('race_months', 'asc')
        ->orderBy('half_flag', 'asc')
        ->get();
        return response()->json(['data' => $races]);
    }
}
