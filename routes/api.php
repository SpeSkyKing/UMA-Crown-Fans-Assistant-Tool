<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RaceController;
use App\Http\Controllers\Api\UserPersonalController;
use App\Http\Controllers\Api\ActerController;
use App\Http\Controllers\Api\UmamusumeController;
use App\Http\Controllers\Api\LiveController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('race')->group(function () {
    Route::apiResource('list', RaceController::class);
    Route::post('list', [RaceController::class, 'raceList']);
    Route::apiResource('registList', RaceController::class);
    Route::get('registList', [RaceController::class, 'raceRegistList']);
    Route::middleware('auth:sanctum')->get('remaining', [RaceController::class, 'remaining']);
    Route::middleware('auth:sanctum')->post('remainingToRace', [RaceController::class, 'remainingToRace']);
    Route::middleware('auth:sanctum')->post('raceRun', [RaceController::class, 'raceRun']);
    Route::middleware('auth:sanctum')->post('remainingPattern', [RaceController::class, 'remainingPattern']);
});

Route::prefix('umamusume')->group(function () {
    Route::middleware('auth:sanctum')->get('registList', [UmamusumeController::class, 'registList']);
    Route::middleware('auth:sanctum')->post('regist', [UmamusumeController::class, 'regist']);
    Route::middleware('auth:sanctum')->get('userRegist', [UmamusumeController::class, 'userRegist']);
    Route::middleware('auth:sanctum')->post('fanUp', [UmamusumeController::class, 'fanUp']);
});

Route::prefix('user')->group(function () {
    Route::post('regist', [UserPersonalController::class, 'regist']);
    Route::post('login', [UserPersonalController::class, 'login'])->name('login');
    Route::middleware('auth:sanctum')->post('logout', [UserPersonalController::class, 'logout']);
    Route::middleware('auth:sanctum')->get('data', [UserPersonalController::class, 'getUserData']);
});

Route::prefix('acter')->group(function () {
    Route::apiResource('acterlist', ActerController::class);
    Route::get('acterlist', [ActerController::class, 'acterList']);
});

Route::prefix('live')->group(function () {
    Route::apiResource('list', LiveController::class);
    Route::get('list', [LiveController::class, 'liveList']);
    Route::middleware('auth:sanctum')->post('umamusumeList', [LiveController::class, 'umamusumeList']);
});

