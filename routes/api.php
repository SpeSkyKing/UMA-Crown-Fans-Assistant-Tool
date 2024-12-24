<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RacelistController;
use App\Http\Controllers\Api\UserPersonalController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('raceList', RacelistController::class);

Route::post('userRegist', [UserPersonalController::class, 'regist']);

Route::post('userLogin', [UserPersonalController::class, 'login']);