import { useState , useEffect } from 'react';
import { Race } from '../../interface/interface';
import { RaceListHeader } from './raceListHeader';
import { RaceListData } from './raceListdata';

//レース情報表示画面
export const RaceList = () => {

    //レース情報を格納する配列
    const [ races , setRaces ] = useState<Race[]>([]);
    
    //ローディング画面
    const [ loading , setLoading ] = useState(true);

    //選択馬場
    const [ selectedState , setSelectedState ] = useState<number>(-1);

    //距離
    const [ selectedDistance , setSelectedDistance ] = useState<number>(-1);

    //レース情報取得処理
    const fetchRaces = async () => {
      try {
        const response = await fetch("/api/race/list",{
          method: "POST",
          body: JSON.stringify({state:selectedState,distance:selectedDistance}),
        });
        const responseJson = await response.json();
        const data = responseJson.data;
        setRaces(data);
      } catch (error) {
        console.error("Failed to fetch races:", error);
      } finally {
        setLoading(false);
      }
    }

    useEffect(() => {
      fetchRaces();
    },[]);

    //馬場もしくは距離が変更された時にレースを取得する
    useEffect(() => {
      fetchRaces();
    }, [selectedState, selectedDistance]);

    if (loading) {
        return <div className="min-h-full flex justify-center bg-Looding bg-cover"></div>
    }

    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="flex space-x-4">
          <div className="flex flex-col items-center">
            <label className="mb-2 text-lg font-semibold text-gray-700 uppercase tracking-wider">馬場</label>
            <select
              className="border-2 border-gray-300 rounded-lg p-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedState}
              onChange={(e) => setSelectedState(Number(e.target.value))}
            >
              <option value={-1}></option>
              <option value={0}>芝</option>
              <option value={1}>ダート</option>
            </select>
          </div>

          <div className="flex flex-col items-center">
            <label className="mb-2 text-lg font-semibold text-gray-700 uppercase tracking-wider">距離</label>
            <select
              className="border-2 border-gray-300 rounded-lg p-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedDistance}
              onChange={(e) => setSelectedDistance(Number(e.target.value))}
            >
              <option value={-1}></option>
              <option value={1}>短距離</option>
              <option value={2}>マイル</option>
              <option value={3}>中距離</option>
              <option value={4}>長距離</option>
            </select>
          </div>
        </div>

        <table className="table-auto w-full border-collapse border border-gray-300">
          <RaceListHeader />
          <tbody>
            {races.map((race) => (
              <RaceListData race={race} />
            ))}
          </tbody>
        </table>
      </div>
    );
};
