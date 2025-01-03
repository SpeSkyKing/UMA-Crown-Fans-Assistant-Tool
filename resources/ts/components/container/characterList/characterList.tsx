import React,{useState,useEffect} from 'react';
import {CharacterListHeader} from './characterListHeader';
import {CharacterListData} from './characterListData';
import {RegistUmamusume} from '../../interface/interface';
export const CharacterList = () => {
      const [registUmamusumes, setRegistUmamusume] = useState<RegistUmamusume[]>([]);
      const [loading,setLoading] = useState(true);
      const [selectUmamusume,SetSelectUmamusume] = useState<RegistUmamusume>();
      const [fanCount, setFanCount] = useState('');
      const [fanDisplay,isFanDisplay] = useState(false);
      const token = localStorage.getItem('auth_token');
      
      useEffect(() => {
            fetchUmamusumes();
      },[]);

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
          setRegistUmamusume(data);
        } catch (error) {
          console.error("Failed to fetch races:", error);
        } finally {
          setLoading(false);
        }
      }

      const fetchFanUp = async () => {
        try {
          const response = await fetch("/api/umamusume/fanUp", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify({umamusumeId:selectUmamusume?.umamusume.umamusume_id,fans:fanCount}),
            });
          const responseJson = await response.json();
          fetchUmamusumes();
        } catch (error) {
          console.error("Failed to fetch races:", error);
        } finally {
          setLoading(false);
        }
      }

      const handleFansUp = (registUmamusume:RegistUmamusume) => {
        SetSelectUmamusume(registUmamusume);
        isFanDisplay(true);
      }

      const addFan = () => {
        fetchFanUp();
        isFanDisplay(false);
      }
      const onReturn = () => {
        isFanDisplay(false);
      }

  
      if (loading) {
          return <div className="min-h-full flex justify-center bg-Looding bg-cover"></div>
      }

      if (fanDisplay) {
        return (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-center text-2xl font-bold text-black my-6">
            {selectUmamusume?.umamusume.umamusume_name}
            </div>
            <div className="text-center text-2xl font-bold text-black my-6">
            現在の値 {selectUmamusume?.fans} 人
            </div>
            <div className="flex items-center space-x-4">
              <input 
                type="number" 
                className="border border-gray-300 px-4 py-2 rounded-lg text-xl" 
                placeholder="ファン数を入力"
                onChange={(e) => setFanCount(e.target.value)} 
              />
              
              <button
                className="bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 hover:from-pink-500 hover:to-blue-500 text-white font-bold py-2 px-6 rounded-lg text-xl transition-all duration-300 ease-in-out transform hover:scale-105"
                onClick={addFan}
              >
                変更
              </button>
              
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg text-xl transition-all duration-300 ease-in-out transform hover:scale-105"
                onClick={onReturn}
              >
                戻る
              </button>
            </div>
          </div>
        );
      }
      

      return (
        <table className="table-auto w-full border-collapse border border-gray-300 ">
          <CharacterListHeader></CharacterListHeader>
          <tbody>
            {registUmamusumes.map((registUmamusume,index) => (
              <CharacterListData key={index} registUmamusume={registUmamusume} returnFanUp={handleFansUp}/>
            ))}
          </tbody>
        </table>
      )
};
