import React,{useState,useEffect} from 'react';
import {Live} from '../interface/interface';
import {LiveListHeader} from './liveListHeader';
import {LiveListData} from './liveListData';
export const LiveList = () => {

    const [lives, setLives] = useState<Live[]>([]);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        const fetchlives = async () => {
            try {
              const response = await fetch("/api/live/list");
              const responseJson = await response.json();
              const data :Live[] = responseJson.data;
              setLives(data);
            } catch (error) {
              console.error("Failed to fetch lives:", error);
            } finally {
              setLoading(false);
            }
          }
          fetchlives();
    },[]);

    if (loading) {
        return <div className="min-h-full flex justify-center bg-Looding bg-cover"></div>
    }
    return (
        <table className="table-auto w-full border-collapse border border-gray-300 ">
          <LiveListHeader></LiveListHeader>
          <tbody>
          {lives.map((live) => (
            <LiveListData live={live}></LiveListData>
          ))}
          </tbody>
        </table>
    );
};
