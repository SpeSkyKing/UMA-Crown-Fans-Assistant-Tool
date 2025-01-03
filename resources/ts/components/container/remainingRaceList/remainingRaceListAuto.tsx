import { useEffect, useState } from 'react';
import {RemainingRaceListAutoProps} from '../../interface/props';
export const RemainingRaceListAuto: React.FC<RemainingRaceListAutoProps>  = ({umamusume,onReturn}) => {

    const [selectUmamsume,setSelectUmamsume] = useState(umamusume);
    const [raceEntryPattern,setRaceEntryPattern] = useState([]);
    const token = localStorage.getItem('auth_token');

    useEffect(() => {
        fetchEntryPattern();
    },[]);

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
                  body: JSON.stringify({umamusumeId:selectUmamsume?.umamusume_id}),
                });
                const responseJson = await response.json();
                const data = responseJson.data;
                setRaceEntryPattern(data);
                console.log(data);
              } catch (error) {
                console.error("Failed to fetch races:", error);
              }
        };

    const handleReturn = () => {
        onReturn();
    }
    return (
        <div>
            <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-xl"
                onClick={handleReturn}
                >
                戻る
            </button>
        </div>
    );
};
