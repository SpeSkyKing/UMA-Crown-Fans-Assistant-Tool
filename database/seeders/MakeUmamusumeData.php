<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use App\Models\Race;
use App\Models\Umamusume;

class MakeUmamusumeData extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $raceJsonFiles = json_decode(Storage::disk('private')->get('json/Race.json'));

        $raceCount = 1;
         foreach($raceJsonFiles as $index => $raceObject){
            if(!Race::where('race_name',$index)->exists()){
                $race  = new Race();
                $race->race_id          = $raceCount;
                $race->race_name        = $raceObject->名前;
                $race->race_state       = $raceObject->馬場 == 'ダート'? 1 : 0;
                switch($raceObject->距離){
                    case '短距離':
                        $race->distance         = 1;
                    break;
                    case 'マイル':
                        $race->distance         = 2;
                    break;  
                    case '中距離':
                        $race->distance         = 3;
                    break;
                    case'長距離':
                        $race->distance         = 4;
                    break;
                }
                
                $race->distance_detail  = (int)$raceObject->距離詳細;
                $race->num_fans         = (int)$raceObject->獲得ファン数;
                switch($raceObject->レースランク){
                    case 'G1':
                        $race->race_rank        = 1;
                    break;
                    case 'G2':
                        $race->race_rank         = 2;
                    break;  
                    case 'G3':
                        $race->race_rank         = 3;
                    break;
                    case 'PRE':
                        $race->race_rank         = 4;
                    break;
                    case 'OP':
                        $race->race_rank         = 5;
                    break;
                }
                $race->senior_flag      = $raceObject->シニア == '〇'? 1 : 0;
                $race->classic_flag     = $raceObject->クラシック == '〇'? 1 : 0;
                $race->junior_flag      = $raceObject->ジュニア == '〇'? 1 : 0;
                $race->race_months      = $raceObject->出走月;
                $race->half_flag        = $raceObject->前後半 == '後半'? 1 : 0;
                $race->scenario_flag   = $raceObject->特定シナリオ == 'あり'? 1 : 0;
                $race->save();
                echo $race->race_name.'を登録しました。'.PHP_EOL;
            }
            $raceCount++;
        }
        // $umamusumeJsonFiles = json_decode(Storage::disk('private')->get('json/Umamusume.json'));

        // foreach($$umamusumeJsonFiles as $index => $object){
        //     if(!Umamusume::where('umamusume_name',$object->名前)->exists()){
        //         $umamusume  = new Umamusume();
        //         $umamusume->umamusume_id = (int)$index;
        //         $umamusume->umamusume_name = $object->名前;
        //         $umamusume->turf_aptitude = $object->芝;
        //         $umamusume->dirt_aptitude = $object->ダート;
        //         $umamusume->front_runner_aptitude = $object->逃げ;
        //         $umamusume->early_foot_aptitude = $object->先行;
        //         $umamusume->midfield_aptitude = $object->差し;
        //         $umamusume->closer_aptitude = $object->追込;
        //         $umamusume->sprint_aptitude = $object->短距離;
        //         $umamusume->mile_aptitude = $object->マイル;
        //         $umamusume->classic_aptitude = $object->中距離;
        //         $umamusume->long_distance_aptitude = $object->長距離;
        //         $umamusume->save();
        //     }  
        // }
    }
}
