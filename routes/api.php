<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RacelistController;
use App\Http\Controllers\Api\UserPersonalController;
use App\Http\Controllers\Api\ActerController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('race')->group(function () {
    Route::apiResource('list', RacelistController::class);
    Route::get('list', [RacelistController::class, 'raceList']);

    Route::apiResource('registList', RacelistController::class);
    Route::get('registList', [RacelistController::class, 'raceRegistList']);
});

Route::prefix('user')->group(function () {
    Route::post('regist', [UserPersonalController::class, 'regist']);
    Route::post('login', [UserPersonalController::class, 'login']);
});

Route::prefix('acter')->group(function () {
    Route::apiResource('acterlist', ActerController::class);
    Route::get('acterlist', [ActerController::class, 'acterList']);
});

