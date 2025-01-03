import React,{useState,useEffect} from 'react';
import {Live,Umamusume} from '../../interface/interface';
import {LiveListHeader} from './liveListHeader';
import {LiveListData} from './liveListData';
import {LiveListCharacterHeader} from './liveListCharacterHeader';
import {LiveListCharacterData} from './liveListCharacterData';
export const LiveList = () => {

    const [lives, setLives] = useState<Live[]>([]);
    const [selectLive,setSelectLive] = useState<Live>();
    const [umamusumes, setUmamusumes] = useState<Umamusume[]>([]);
    const [loading,setLoading] = useState(true);
    const [isCharacter,setIsCharacter] = useState(false);
    const token = localStorage.getItem('auth_token');

    const onClick = (live : Live) =>{
      setSelectLive(live);
      fetchUmamusumes(live);
      setIsCharacter(true);
    }

    const onReturn = () => {
      setIsCharacter(false);
    }

    useEffect(() => {
          fetchlives();
    },[]);

    const fetchUmamusumes = async (live : Live) => {
      try {
        if (!token) {
          console.error('トークンが見つかりません');
          return;
      }
      const response = await fetch("/api/live/umamusumeList",{
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({liveId:live?.live_id}),
      });
        const responseJson = await response.json();
        const data :Umamusume[] = responseJson.data;
        setUmamusumes(data);
      } catch (error) {
        console.error("Failed to fetch lives:", error);
      } finally {
        setLoading(false);
      }
    }

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

    if (loading) {
        return <div className="min-h-full flex justify-center bg-Looding bg-cover"></div>
    }

    if(isCharacter){
      return(
        <div className="overflow-hidden">
        <div className="text-center text-2xl font-bold text-black my-6">
            {selectLive?.live_name}
        </div>
    
        <div className="flex justify-center mb-6">
            <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-xl"
                onClick={onReturn}
            >
                戻る
            </button>
        </div>
    
        <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
                <LiveListCharacterHeader />
                <tbody className="max-h-40 overflow-y-auto">
                    {umamusumes.map((umamusume) => (
                        <LiveListCharacterData key={umamusume.umamusume_id} umamusume={umamusume} />
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    
      )
    }


    return (
        <table className="table-auto w-full border-collapse border border-gray-300 ">
          <LiveListHeader></LiveListHeader>
          <tbody>
          {lives.map((live) => (
            <LiveListData live={live} onClick={onClick}/>
          ))}
          </tbody>
        </table>
    );
};
