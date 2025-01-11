<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use App\Models\Race;
use App\Models\Umamusume;
use App\Models\UmamusumeActer;
use App\Models\ScenarioRace;
use App\Models\Live;
use App\Models\VocalUmamusume;

class MakeUmamusumeData extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $raceJsonFiles = json_decode(Storage::disk('private')->get('json/Race.json'),true);

        $umamusumeJsonFiles = json_decode(Storage::disk('private')->get('json/Umamusume.json'),true);

        $this->setRaceTables($raceJsonFiles);

        $umamusumeCount = 1;
        foreach($umamusumeJsonFiles as $index => $object){
            if(!Umamusume::where('umamusume_name',$index)->exists()){
                $this->setUmamusumeTable($object,$umamusumeCount);
            }
            $this->setScenarioRace($object['シナリオ'],$index,$umamusumeCount);

            $this->setActerTable($object['声優'],$index,$umamusumeCount);
            $umamusumeCount++;
        }

        $liveJsonFiles = json_decode(Storage::disk('private')->get('json/Live.json'),true);
        $this->setLiveTables($liveJsonFiles);

    }

    private function setRaceTables(array $raceJsonFiles){
        $raceCount = 1;
         foreach($raceJsonFiles as $index => $raceObject){
            if(!Race::where('race_name',$index)->exists()){
                $race  = new Race();
                $race->race_id          = $raceCount;
                $race->race_name        = $raceObject['名前'];
                $race->race_state       = $raceObject['馬場'] == 'ダート'? 1 : 0;
                $race->distance         = $this->getRaceDistance($raceObject['距離']);
                $race->distance_detail  = (int)$raceObject['距離詳細'];
                $race->num_fans         = (int)$raceObject['獲得ファン数'];
                $race->race_rank        = $this->getRaceRank($raceObject['レースランク']);
                $race->senior_flag      = $raceObject['シニア'] == '〇'? 1 : 0;
                $race->classic_flag     = $raceObject['クラシック'] == '〇'? 1 : 0;
                $race->junior_flag      = $raceObject['ジュニア'] == '〇'? 1 : 0;
                $race->race_months      = $raceObject['出走月'];
                $race->half_flag        = $raceObject['前後半'] == '後半'? 1 : 0;
                $race->scenario_flag    = $raceObject['特定シナリオ'] == 'あり'? 1 : 0;
                $race->save();
                echo $race->race_name.'を登録しました。'.PHP_EOL;
            }
            $raceCount++;
        }
    }

    private function getRaceDistance(string $raceDistance){
        switch($raceDistance){
            case '短距離':
                return 1;
            break;
            case 'マイル':
                return 2;
            break;  
            case '中距離':
                return 3;
            break;
            case'長距離':
                return 4;
            break;
        }
    }

    private function getRaceRank(string $raceRank){
        switch($raceRank){
            case 'G1':
                return 1;
            break;
            case 'G2':
                return 2;
            break;  
            case 'G3':
                return 3;
            break;
            case 'PRE':
                return 4;
            break;
            case 'OP':
                return 5;
            break;
        }
    }

    private function setUmamusumeTable(array $object,int $count){
        $umamusume  = new Umamusume();
        $umamusume->umamusume_id = $count;
        $umamusume->umamusume_name = $object['名前'];
        $umamusume->turf_aptitude = $object['芝'];
        $umamusume->dirt_aptitude = $object['ダート'];
        $umamusume->front_runner_aptitude = $object['逃げ'];
        $umamusume->early_foot_aptitude = $object['先行'];
        $umamusume->midfield_aptitude = $object['差し'];
        $umamusume->closer_aptitude = $object['追込'];
        $umamusume->sprint_aptitude = $object['短距離'];
        $umamusume->mile_aptitude = $object['マイル'];
        $umamusume->classic_aptitude = $object['中距離'];
        $umamusume->long_distance_aptitude = $object['長距離'];
        $umamusume->save();
        echo $umamusume->umamusume_name.'を登録しました。'.PHP_EOL;
    }

    private function setScenarioRace(array $object,string $index,int $count){
        $scenarioRaceCount = 1;
        $randomGroupId = 1;
        foreach($object as $objectScenarioRace){
            if(is_array($objectScenarioRace) && !isset($objectScenarioRace['時期'])){
                foreach($objectScenarioRace as $scenarioRaceRandom){
                    $scenarioRaceCount = $this->setRace($scenarioRaceRandom,$count,$scenarioRaceCount,$index,$randomGroupId); 
                }
                $randomGroupId++;
            }else{
                $scenarioRaceCount = $this->setRace($objectScenarioRace,$count,$scenarioRaceCount,$index);
            }
        }
    }

    private function setRace($race, int $count ,int $raceCount,string $index ,?int $randomGroupId = null ){
        if(is_array($race)){
            $randomRace  = new ScenarioRace();
            $raceId = Race::where('race_name',$race['名前'])->first()->race_id;
            if(!is_null($raceId) && !ScenarioRace::where('race_id',$raceId)->where('umamusume_id',$count)->exists()){
                $randomRace->umamusume_id = $count;
                $randomRace->race_id =  $raceId;
                $randomRace->race_number = $raceCount;
                $randomRace->random_group = $randomGroupId;
                $randomRace->senior_flag = $race['時期'] == 'シニア' ? true : false;
                $randomRace->save();
                echo $index.'にシナリオレースの'.$race['名前'].'を登録しました。'.PHP_EOL;
            }
        }else{
            $randomRace  = new ScenarioRace();
            $raceId = Race::where('race_name',$race)->first()->race_id;
            if(!is_null($raceId) && !ScenarioRace::where('race_id',$raceId)->where('umamusume_id',$count)->exists()){
                $randomRace->umamusume_id = $count;
                $randomRace->race_id =  $raceId;
                $randomRace->race_number = $raceCount;
                $randomRace->random_group = $randomGroupId;
                $randomRace->save();
                echo $index.'にシナリオレースの'.$race.'を登録しました。'.PHP_EOL;
            }
        }
        $raceCount++;
        return $raceCount;
    }

    private function setActerTable(array $object,string $umamusumeName,int $count){
        if(!UmamusumeActer::where('acter_name',$object['名前'])->exists()){
            $umamusumeActer                 = new UmamusumeActer();
            $umamusumeActer->acter_id       = $count;
            $umamusumeActer->umamusume_id   = $count;
            $umamusumeActer->acter_name     = $object['名前'];
            $umamusumeActer->gender         = $this->getGender($object['性別']);
            $umamusumeActer->birthday       = $object['誕生日'];
            $umamusumeActer->nickname       = $object['愛称'];
            $umamusumeActer->save();
            echo $umamusumeName.'の声優に'.$umamusumeActer->acter_name.'を登録しました。'.PHP_EOL;
            }
    }

    private function getGender(string $gender){
        switch($gender){
            case '不明':
                return 0;
                break;
            case '男':
                return 1;
                break;
            case '女':
                return 2;
                break;
        }
    }

    private function setLiveTables(array $object){
        $liveCount = 1;
        foreach($object as $live){
            if(!Live::where('live_name',$live['曲名'])->exists()){
                $live_ = new Live();
                $live_->live_id = $liveCount;
                $live_->live_name = $live['曲名'];
                $live_->composer = $live['作曲'];
                $live_->arranger =  $live['編曲'];
                $live_->save();
                echo $live['曲名'].'を登録しました。'.PHP_EOL;
            }
            if($live['歌唱ウマ娘'][1] == 'all'){
                $umamusumeArray = Umamusume::select('umamusume_id')->get();
                foreach($umamusumeArray as $umamusume){
                    if(!VocalUmamusume::where('live_id',$liveCount)->where('umamusume_id',$umamusume->umamusume_id)->exists()){
                        $vocalUmamusume = new VocalUmamusume();
                        $vocalUmamusume->live_id = $liveCount;
                        $vocalUmamusume->umamusume_id = $umamusume->umamusume_id;
                        $vocalUmamusume->save();
                    }
                }
                echo $live['曲名'].'に全員を登録しました。'.PHP_EOL;
            }else{
                foreach($live['歌唱ウマ娘'] as $liveUmamusume){
                    $umamusmeData = Umamusume::where('umamusume_name',$liveUmamusume)->first();
                    if(!VocalUmamusume::where('live_id',$liveCount)->where('umamusume_id',$umamusmeData->umamusume_id)->exists()){
                        $vocalUmamusume = new VocalUmamusume();
                        $vocalUmamusume->live_id = $liveCount;
                        $vocalUmamusume->umamusume_id = $umamusmeData->umamusume_id;
                        $vocalUmamusume->save();
                        echo $live['曲名'].'に'.$liveUmamusume.'を登録しました。'.PHP_EOL;
                    }
                }
            }
            $liveCount++;
        }
    }
}
