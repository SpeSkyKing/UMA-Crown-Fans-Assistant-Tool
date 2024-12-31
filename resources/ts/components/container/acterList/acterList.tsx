import React,{useState,useEffect} from 'react';
import {ActerListHeader} from './acterListHeader';
import {ActerListData} from './acterListData';
import {Acter} from '../../interface/interface';
export const ActerList = () => {
      const [acters, setActers] = useState<Acter[]>([]);
      const [loading,setLoading] = useState(true);
      
      useEffect(() => {
          const fetchActers = async () => {
              try {
                const response = await fetch("/api/acter/acterlist");
                const responseJson = await response.json();
                const data :Acter[] = responseJson.data;
                setActers(data);
              } catch (error) {
                console.error("Failed to fetch races:", error);
              } finally {
                setLoading(false);
              }
            }
            fetchActers();
      },[]);
  
      if (loading) {
          return <div className="min-h-full flex justify-center bg-Looding bg-cover"></div>
      }

      return (
          <table className="table-auto w-full border-collapse border border-gray-300 ">
              <ActerListHeader></ActerListHeader>
              <tbody>
                {acters.map((acter,index) => (
                  <ActerListData key={index} acter={acter}></ActerListData>
                ))}
              </tbody>
          </table>
      )
};
