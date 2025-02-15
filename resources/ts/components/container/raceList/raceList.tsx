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

    //レース情報取得処理
    const fetchRaces = async () => {
      try {
        const response = await fetch("/api/race/list");
        const responseJson = await response.json();
        const data :Race[] = responseJson.data;
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

    if (loading) {
        return <div className="min-h-full flex justify-center bg-Looding bg-cover"></div>
    }
    return (
      <table className="table-auto w-full border-collapse border border-gray-300 ">
        <RaceListHeader></RaceListHeader>
        <tbody>
        {races.map((race) => (
          <RaceListData race={race} />
        ))}
        </tbody>
      </table>
    );
};
