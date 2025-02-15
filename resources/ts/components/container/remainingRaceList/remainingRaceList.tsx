import { useState , useEffect } from 'react';
import { Umamusume , RemainingRace , RaceEntryPattern } from '../../interface/interface';
import { RemainingRaceListHeader } from './remainingRaceListHeader';
import { RemainingRaceListData } from './remainingRaceListData';
import { RemainingRaceListManual } from "./remainingRaceListManual";

//残レース情報表示画面
export const RemainingRaceList = () => {
    
    //残レース情報を格納する配列
    const [ remainingRaces, setRemainingRaces ] = useState<RemainingRace[]>([]);
    
    //ローディング画面
    const [ loading , setLoading ] = useState(true);
    
    //ウマ娘を選択しているか判定する
    const [ isCheckRace , setIsCheckRace ] = useState(false);
    
    //選択したウマ娘情報を格納する
    const [ selectUmamusume , setSelectUmamusume ] = useState<Umamusume | undefined>(undefined);
    
    //推奨情報を格納する
    const [ raceEntryPattern , setRaceEntryPattern ] = useState<RaceEntryPattern>();
    
    //レース出走処理画面の表示有無
    const [ isManualRaces , setIsManualRaces ] = useState(false);
    
    //トークン情報
    const token = localStorage.getItem('auth_token');

    //残レース情報を取得する
    const fetchRaces = async () => {
      try {
        const response = await fetch("/api/race/remaining",{
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        const responseJson = await response.json();
        const data :RemainingRace[] = responseJson.data;
        setRemainingRaces(data);
      } catch (error) {
        console.error("Failed to fetch races:", error);
      } finally {
        setLoading(false);
      }
    }

    //レース出走推奨パターンを取得する
    const fetchEntryPattern = async (umamusume : Umamusume) => {
          try {
            if (!token) {
                console.error('トークンが見つかりません');
                return;
            }
            const response = await fetch("/api/race/remainingPattern",{
              method: "POST",
              headers: {
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify({umamusumeId:umamusume?.umamusume_id}),
            });
            const responseJson = await response.json();
            const data = responseJson.data;
            setRaceEntryPattern(data);
          } catch (error) {
            console.error("Failed to fetch races:", error);
          }
    };

    //出走を行う処理
    const openCheckRaces = (umamusume : Umamusume) => {
      setSelectUmamusume(umamusume);
      fetchEntryPattern(umamusume);
      setIsCheckRace(true);
    };

    //戻るボタンを押下した処理
    const returnCheckRaces = () => {
      fetchRaces();
      setIsCheckRace(false);
      setIsManualRaces(false);
    }

    //レース出走を表示する
    const onManualRaces = () =>{
      setIsManualRaces(true);
    }

    useEffect(() => {
      fetchRaces();
    },[]);

    if (loading) {
      return <div className="min-h-full flex justify-center bg-cover"></div>
    }
    
    if (isManualRaces) {
      return <RemainingRaceListManual umamusume={selectUmamusume} onReturn={returnCheckRaces}></RemainingRaceListManual>
    }

    if (isCheckRace){
      return (
        <div className="w-full h-screen flex flex-col items-center justify-center space-y-8">
          <div className="flex justify-center w-full max-w-[600px] p-4">
            <div className="flex justify-center w-full">
              <span className="font-bold text-2xl">{selectUmamusume?.umamusume_name}</span>
            </div>
          </div>

        <div className="flex justify-between w-full max-w-[600px] bg-white p-4 rounded-xl shadow-lg">
          <div className="flex justify-between w-full">
            <span className="pr-4 text-lg text-gray-600">おすすめシナリオ</span>
            <span className="pl-4 font-bold text-2xl">{raceEntryPattern?.selectScenario}</span>
          </div>
        </div>

        <div className="w-full max-w-[600px]">
          <span className="text-lg text-gray-600 text-center">おすすめ因子</span>
          <div className="mt-6 space-y-6">
            {raceEntryPattern?.requiredsFactor.map((factor, index) => (
              <div key={index} className="flex justify-center items-center bg-white p-4 rounded-xl shadow-md hover:bg-pink-50">
                <div className="flex justify-between w-full space-x-4">
                  <span className="text-lg font-semibold text-purple-800">{factor}</span>
                  <span className="text-xl text-yellow-500">★ ★ ★</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      
      
            <div className="flex flex-col space-y-6">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl"
                onClick={onManualRaces}>
                    出走
                </button>
                <button className="bg-red-500 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-lg" 
                onClick={returnCheckRaces}>
                    戻る
                </button>
            </div>
          </div>
      )
    }

    return (
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead className="sticky top-0 bg-white z-10">
          <th colSpan={3} className="border border-gray-300 px-4 py-2">基本情報</th>
          <th colSpan={4} className="border border-gray-300 px-4 py-2 bg-green-400">芝</th>
          <th colSpan={3} className="border border-gray-300 px-4 py-2 bg-red-400">ダート</th>
        </thead>
        <RemainingRaceListHeader></RemainingRaceListHeader>
        <tbody>
          {remainingRaces.map((remainingRace) => (
            <RemainingRaceListData remainingRace={remainingRace} checkRaces={openCheckRaces} />
          ))}
        </tbody>
      </table>
    );
};
