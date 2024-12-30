import React,{useState,useEffect} from 'react';
import {CharacterListHeader} from './characterListHeader';
import {CharacterListData} from './characterListData';
import {RegistUmamusume} from '../../interface/interface';
export const CharacterList = () => {
      const [registUmamusumes, setRegistUmamusume] = useState<RegistUmamusume[]>([]);
      const [loading,setLoading] = useState(true);
      const token = localStorage.getItem('auth_token');
      
      useEffect(() => {
          const fetchUmamusumes = async () => {
              try {
                const response = await fetch("/api/umamusume/userRegist", {
                    method: "GET",
                    headers: {
                      "Authorization": `Bearer ${token}`,
                    },
                  });
                const responseJson = await response.json();
                const data :RegistUmamusume[] = responseJson.data;
                console.log(data)
                setRegistUmamusume(data);
              } catch (error) {
                console.error("Failed to fetch races:", error);
              } finally {
                setLoading(false);
              }
            }
            fetchUmamusumes();
      },[]);
  
      if (loading) {
          return <div className="min-h-full flex justify-center bg-Looding bg-cover"></div>
      }

      return (
        <div className="min-h-full flex justify-center">
          <div className="w-11/12 max-w-10xl rounded-lg p-6 shadow-lg relative">
            
            <div className="w-11/12 h-9/10 absolute inset-0 m-auto bg-white/50 rounded-lg shadow-lg overflow-auto p-4 overflow-auto scrollbar-hide">
              <table className="table-auto w-full border-collapse border border-gray-300 ">
                  <CharacterListHeader></CharacterListHeader>
                  <tbody>
                    {registUmamusumes.map((registUmamusume,index) => (
                      <CharacterListData key={index} registUmamusume={registUmamusume}></CharacterListData>
                    ))}
                  </tbody>
              </table>
            </div>
          </div>
        </div>
      )
};
