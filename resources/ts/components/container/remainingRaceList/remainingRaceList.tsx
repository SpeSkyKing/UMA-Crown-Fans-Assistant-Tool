import React,{useState,useEffect} from 'react';
import { Umamusume ,RemainingRace,RaceEntryPattern} from '../../interface/interface';
import {RemainingRaceListHeader} from './remainingRaceListHeader';
import {RemainingRaceListData} from './remainingRaceListData';
import {RemainingRaceListManual} from "./remainingRaceListManual";
export const RemainingRaceList = () => {
    const [remainingRaces, setRemainingRaces] = useState<RemainingRace[]>([]);
    const [loading,setLoading] = useState(true);
    const [isCheckRace,setIsCheckRace] = useState(false);
    const [selectUmamusume, setSelectUmamusume] = useState<Umamusume | undefined>(undefined);
    const [raceEntryPattern,setRaceEntryPattern] = useState<RaceEntryPattern>();
    const [isManualRaces,setIsManualRaces] = useState(false);
    const token = localStorage.getItem('auth_token');

    useEffect(() => {
        fetchRaces();
    },[]);

    useEffect(() => {
      if (selectUmamusume != undefined) {
        setIsCheckRace(true);
      }
    },[selectUmamusume]);

    useEffect(() => {
      setRaceEntryPattern(raceEntryPattern);
    },[raceEntryPattern]);

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

    const fetchEntryPattern = async () => {
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
                  body: JSON.stringify({umamusumeId:selectUmamusume?.umamusume_id}),
                });
                const responseJson = await response.json();
                const data = responseJson.data;
                setRaceEntryPattern(data);
                console.log(data);
              } catch (error) {
                console.error("Failed to fetch races:", error);
              }
        };

    const openCheckRaces = (umamusume : Umamusume) => {
      fetchEntryPattern();  
      setSelectUmamusume(umamusume);
    };

    const returnCheckRaces = () => {
      setIsCheckRace(false);
      setIsManualRaces(false);
      fetchRaces();
    }

    const onManualRaces = () =>{
      setIsManualRaces(true);
    }
    
    if (isManualRaces) {
      return <RemainingRaceListManual umamusume={selectUmamusume} onReturn={returnCheckRaces}></RemainingRaceListManual>
    }


    if (loading) {
        return <div className="min-h-full flex justify-center bg-Looding bg-cover"></div>
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
