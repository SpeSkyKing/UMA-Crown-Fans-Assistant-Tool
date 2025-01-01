import { useEffect, useState } from 'react';
import { Race,Umamusume } from '../../interface/interface';
import {RemainingRaceListItem} from './remainingRaceListItem';
import {RemainingRaceListManualProps} from '../../interface/props';
export const RemainingRaceListManual : React.FC<RemainingRaceListManualProps> = ({umamusume}) => {
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [selectedMonth, setSelectedMonth] = useState(7);
    const [selectedHalf, setSelectedHalf] = useState(1);
    const [selectUmamsume,setSelectUmamsume] = useState(umamusume);
    const [isAutoMode, setIsAutoMode] = useState(false);
    const [races,setRaces] = useState<Race[]>([]);
    const token = localStorage.getItem('auth_token');

    const handleAutoModeChange = () => {
        setIsAutoMode(!isAutoMode);
    };

    const handleRunRace = (raceId : number) => {
        raceRunRegist(raceId);
    };

    useEffect(() => {
        fetchRemainingRaces();
    },[]);

    useEffect(() => {
        fetchRemainingRaces();
      }, [selectedSeason, selectedMonth, selectedHalf]);

    const fetchRemainingRaces = async (retryCount = 0) => {
          try {
            if (!token) {
                console.error('トークンが見つかりません');
                return;
            }
            const response = await fetch("/api/race/remainingToRace",{
              method: "POST",
              headers: {
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify({season:selectedSeason,month:selectedMonth,half:selectedHalf,umamusumeId:selectUmamsume.umamusume_id}),
            });
            const responseJson = await response.json();
            const data :Race[] = responseJson.data;
            setRaces(data);
          } catch (error) {
            console.error("Failed to fetch races:", error);
          }
    };

    const raceRunRegist = async (raceId : number)  => {
        try {
            if (!token) {
                console.error('トークンが見つかりません');
                return;
            }
            const response = await fetch("/api/race/raceRun", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({umamusumeId:selectUmamsume?.umamusume_id,raceId:raceId}),
            });
  
            if (!response.ok) {
                throw new Error("出走できませんでした。");
            }
            const data = await response.json();
            
        } catch (error) {
  
        }
        if(isAutoMode){
            raceForward();
        }
        fetchRemainingRaces();
    };

    const raceForward = () =>{
        let isHalf = selectedHalf == 1 ? 0 : 1;
        let isMunth = selectedMonth;
        let isSeason = selectedSeason;
        if(selectedHalf){
            isMunth = selectedMonth + 1
            if(selectedMonth == 12){
                isMunth = 1;
                if(selectedSeason < 3){
                    isSeason = selectedSeason + 1;
                }
            }
        }
        setSelectedMonth(isMunth);
        setSelectedHalf(isHalf);
        setSelectedSeason(isSeason);
    }
  

    return (
        <div className="min-h-screen flex flex-col items-center p-6">
            <div className="flex space-x-4 mb-6">
                <select
                    className="border border-gray-300 rounded p-2"
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(Number(e.target.value))}
                >
                    <option value="1">ジュニア</option>
                    <option value="2">クラシック</option>
                    <option value="3">シニア</option>
                </select>

                {/* 月 */}
                <select
                    className="border border-gray-300 rounded p-2"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                    <option value="1">1月</option>
                    <option value="2">2月</option>
                    <option value="3">3月</option>
                    <option value="4">4月</option>
                    <option value="5">5月</option>
                    <option value="6">6月</option>
                    <option value="7">7月</option>
                    <option value="8">8月</option>
                    <option value="9">9月</option>
                    <option value="10">10月</option>
                    <option value="11">11月</option>
                    <option value="12">12月</option>
                </select>

                <select
                    className="border border-gray-300 rounded p-2"
                    value={selectedHalf}
                    onChange={(e) => setSelectedHalf(Number(e.target.value))}
                >
                    <option value="0">前半</option>
                    <option value="1">後半</option>
                </select>
            </div>

            <table className="table-auto w-full border-collapse border border-gray-300 mb-6">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2 text-center">レース名</th>
                        <th className="px-4 py-2 text-center">馬場</th>
                        <th className="px-4 py-2 text-center">距離</th>
                        <th className="px-4 py-2 text-center">出走</th>
                    </tr>
                </thead>
                <tbody>
                    {races.map((race) => (
                            <RemainingRaceListItem key={race.race_id} race={race} runRace={handleRunRace} />
                        )
                    )}
                </tbody>
            </table>

            <div className="flex flex-col space-y-6">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl"
                onClick={raceForward}>
                    次へ
                </button>
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-xl"
                onClick={raceForward}>
                    前へ
                </button>
            </div>

            <div className="flex items-center mb-6">
                <input
                    type="checkbox"
                    id="autoMode"
                    checked={isAutoMode}
                    onChange={handleAutoModeChange}
                    className="mr-2"
                />
                <label htmlFor="autoMode" className="text-lg">オートモード</label>
            </div>

            {isAutoMode && (
                <div className="text-gray-700 text-center mb-4">
                    オートモードがオンの場合、出走後自動的に次の時期に進みます。
                </div>
            )}
        </div>
    );
};
