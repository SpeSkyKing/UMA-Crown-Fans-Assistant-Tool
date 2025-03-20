import { CharacterListFansProps } from "../../interface/props";
import { useState } from "react";
import { ReservedRace } from "../../interface/interface";

//ファン数変動画面
export const CharacterListFans : React.FC<CharacterListFansProps>  = ({ selectUmamusume , countUp , returnAddFan , returnOnReturn , returnFanCalculation }) => {

  //ファン数計算処理のレースを格納する
  const [reservedRace,SetReservedRace] = useState<ReservedRace[]>([]);

  //入力したファン数の状態管理
  const setFanCount = (fans:string) => {
    countUp(Number(fans));
  } 

  //変更処理を反映させる
  const addFan = () => {
    returnAddFan();
  }

  //画面をウマ娘の情報表示画面へ変更する
  const onReturn = () => {
    returnOnReturn();
  } 

  //ファン計算画面表示
  const FanCalculation = () =>{
    returnFanCalculation();
  }


  //Todo ファン効率計算処理の追加
        return (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div 
            className="text-center text-4xl font-bold text-white my-12" 
            style={{ 
              backgroundImage: `url(/storage/image/umamusumeData/${selectUmamusume?.umamusume.umamusume_name}.png)`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center', 
              padding: '50px',
            }}
          >
            {selectUmamusume?.umamusume.umamusume_name}
          </div>


            <div className="text-center text-2xl font-bold text-black my-6">
            現在の値 {selectUmamusume?.fans} 人
            </div>
            <div className="block">
              <input 
                type="number" 
                className="border border-gray-300 px-4 py-2 rounded-lg text-xl w-full" 
                placeholder="ファン数を入力"
                onChange={(e) => setFanCount(e.target.value)} 
              />
              <div className="flex justify-between mt-4 space-x-4">
                <button
                  className="bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 hover:from-pink-500 hover:to-blue-500 text-white font-bold py-2 px-6 rounded-lg text-xl transition-all duration-300 ease-in-out transform hover:scale-105 w-full"
                  onClick={addFan}
                >
                  変更
                </button>
                <button
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg text-xl transition-all duration-300 ease-in-out transform hover:scale-105 w-full"
                  onClick={onReturn}
                >
                  戻る
                </button>
              </div>
              <div className="mt-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-xl transition-all duration-300 ease-in-out transform hover:scale-105 w-full"
                  onClick={FanCalculation}
                >
                  ファン効率計算処理
                </button>
              </div>
            </div>
          </div>
        );
};
