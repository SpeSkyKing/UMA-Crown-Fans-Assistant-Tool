<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UmamusumeActer;

class ActerController extends Controller
{
    public function acterList()
    {
        $acters = UmamusumeActer::with('Umamusume')
        ->orderBy('birthday','desc')->get();

        return response()->json(['data' => $acters]);
    }
}
