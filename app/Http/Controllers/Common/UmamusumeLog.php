<?php

namespace App\Http\Controllers\Common;
use Illuminate\Support\Facades\Log;
class UmamusumeLog extends Log
{

    //ログ処理を行う関数
    public function logWrite( string $msg, string $attribute): void{
        switch($msg){
            case 'start':
                $this->logStart(attribute: $attribute);
                break;
            case 'end':
                $this->logEnd(attribute: $attribute);
                break;
            case 'error':
                $this->logError(attribute: $attribute);
                break;
            default:
                throw new \Exception(message: "msgの値に問題があります。");
        }
    }

    //処理開始のログを記載する
    private function logStart(string $attribute): void{
        UmamusumeLog::info($attribute.'の処理を開始します。');
    }

    //処理終了のログを記載する
    private function logEnd(string $attribute): void{
        UmamusumeLog::info($attribute.'の処理を終了します。');
    }

    //エラーログを記載する
    private function logError(string $attribute): void{
        UmamusumeLog::error($attribute.'に失敗しました。');
    }
}
