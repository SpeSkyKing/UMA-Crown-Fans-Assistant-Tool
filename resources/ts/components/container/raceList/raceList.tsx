import React,{useState,useEffect} from 'react';
import {Race} from '../../interface/interface';
import {RaceListHeader} from './raceListHeader';
import {RaceListdata} from './raceListdata';
export const RaceList = () => {

    const [races, setRaces] = useState<Race[]>([]);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
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
          <RaceListdata race={race}></RaceListdata>
        ))}
        </tbody>
      </table>
    );
};
