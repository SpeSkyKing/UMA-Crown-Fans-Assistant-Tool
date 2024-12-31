import React,{useState,useEffect} from 'react';
import {RemainingRace} from '../interface/interface';
import {RemainingRaceListHeader} from './remainingRaceListHeader';
import {RemainingRaceListData} from './remainingRaceListData';
export const RemainingRaceList = () => {

    const [remainingRaces, setRemainingRaces] = useState<RemainingRace[]>([]);
    const [loading,setLoading] = useState(true);
    const token = localStorage.getItem('auth_token');

    useEffect(() => {
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
          fetchRaces();
    },[]);

    if (loading) {
        return <div className="min-h-full flex justify-center bg-Looding bg-cover"></div>
    }
    return (
    <div className="min-h-full flex justify-center">
      <div className="w-11/12 max-w-10xl rounded-lg p-6 shadow-lg relative">
        
        <div className="w-11/12 h-9/10 absolute inset-0 m-auto bg-white/50 rounded-lg shadow-lg overflow-auto p-4 scrollbar-hide">
          <table className="table-auto w-full border-collapse border border-gray-300 ">
            <RemainingRaceListHeader></RemainingRaceListHeader>
            <tbody>
            {remainingRaces.map((remainingRaces) => (
              <RemainingRaceListData remainingRaces={remainingRaces}></RemainingRaceListData>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    );
};
