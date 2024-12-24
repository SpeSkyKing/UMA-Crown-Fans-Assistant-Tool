import React,{useState,useEffect} from 'react';
import {Race} from '../../interface/DBinterface';
import {RaceListHeader} from './raceListHeader';
import {RaceListdata} from './raceListdata';
export const RaceList = () => {

    const [races, setRaces] = useState<Race[]>([]);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        const fetchRaces = async () => {
            try {
              const response = await fetch("/api/raceList");
              const responseJson = await response.json();
              const data :Race[] = responseJson.data;
              setRaces(data);
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
        
        <div className="w-11/12 h-9/10 absolute inset-0 m-auto bg-white/50 rounded-lg shadow-lg overflow-auto p-4 overflow-auto scrollbar-hide">
          <table className="table-auto w-full border-collapse border border-gray-300 ">
            <thead>
              <RaceListHeader></RaceListHeader>
            </thead>
            <tbody>
            {races.map((race) => (
              <RaceListdata race={race}></RaceListdata>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    
    );
};
