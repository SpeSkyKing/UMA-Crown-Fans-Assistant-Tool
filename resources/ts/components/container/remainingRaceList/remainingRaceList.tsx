import React,{useState,useEffect} from 'react';
import { Umamusume ,RemainingRace} from '../../interface/interface';
import {RemainingRaceListHeader} from './remainingRaceListHeader';
import {RemainingRaceListData} from './remainingRaceListData';
import {RemainingRaceListAuto} from './remainingRaceListAuto'
import {RemainingRaceListManual} from "./remainingRaceListManual";
export const RemainingRaceList = () => {
    const [remainingRaces, setRemainingRaces] = useState<RemainingRace[]>([]);
    const [loading,setLoading] = useState(true);
    const [isCheckRace,setIsCheckRace] = useState(false);
    const [selectUmamusume,setSelectUmamusume] = useState<Umamusume>();
    const [isAutoRaces,setIsAutoRaces] = useState(false);
    const [isManualRaces,setIsManualRaces] = useState(false);
    const token = localStorage.getItem('auth_token');

    useEffect(() => {
        fetchRaces();
    },[]);

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

    const openCheckRaces = (umamusume : Umamusume) => {
      setSelectUmamusume(umamusume);
      setIsCheckRace(true);
    };

    const returnCheckRaces = () => {
      setIsCheckRace(false);
      setIsAutoRaces(false);
      setIsManualRaces(false);
    }

    const onAutoRaces = () =>{
      setIsAutoRaces(true);
    }

    const onManualRaces = () =>{
      setIsManualRaces(true);
    }
    
    if (isManualRaces) {
      return <RemainingRaceListManual umamusume={selectUmamusume} onReturn={returnCheckRaces}></RemainingRaceListManual>
    }

    if (isAutoRaces) {
      return <RemainingRaceListAuto umamusume={selectUmamusume} onReturn={returnCheckRaces}></RemainingRaceListAuto>
    }

    if (loading) {
        return <div className="min-h-full flex justify-center bg-Looding bg-cover"></div>
    }

    if (isCheckRace){
      return (
        <div className="table-auto w-full h-screen flex flex-col items-center justify-center">
          <div className="text-center text-2xl font-bold text-black my-6">
                {selectUmamusume.umamusume_name}
          </div>
            <div className="flex flex-col space-y-6">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl"
                onClick={onManualRaces}>
                    手動出走
                </button>
                {/* <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-xl"
                onClick={onAutoRaces}>
                    出走計算
                </button> */}
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
        <RemainingRaceListHeader></RemainingRaceListHeader>
        <tbody>
          {remainingRaces.map((remainingRace) => (
            <RemainingRaceListData remainingRace={remainingRace} checkRaces={openCheckRaces} />
          ))}
        </tbody>
      </table>
    );
};
