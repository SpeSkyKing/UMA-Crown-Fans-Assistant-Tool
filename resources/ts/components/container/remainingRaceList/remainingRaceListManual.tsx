import { useEffect, useState } from 'react';
import { Race } from '../../interface/interface';
import { RemainingRaceListItem } from './remainingRaceListItem';
import { RemainingRaceListManualProps } from '../../interface/props';
import { RemainingRaceListManualHeader } from './remainingRaceListManualHeader';

//レース出走画面
export const RemainingRaceListManual : React.FC<RemainingRaceListManualProps> = ({ umamusume , token, onReturn }) => {
    
    //選択しているシーズン ※初期はジュニアのため1
    const [ selectedSeason, setSelectedSeason ] = useState(1);
    
    //選択している出走月 ※初期は7月のため7
    const [ selectedMonth, setSelectedMonth ] = useState(7);
    
    //選択している前後半 ※初期は後半のため1
    const [ selectedHalf, setSelectedHalf ] = useState(1);
    
    //出走オートモードか判定する処理
    const [ isAutoMode , setIsAutoMode ] = useState(false);
    
    //画面表示するレース情報を格納する配列
    const [ races , setRaces ] = useState<Race[]>([]);
    
    //前へボタンを表示するか判定する
    const [ isRaceReturn , setIsRaceReturn ] = useState(true);
    
    //次へボタンを表示するか判定する
    const [ isRaceForward , setIsRaceForward ] = useState(true);
    
    //選択ウマ娘情報
    const [selectUmamsume,setSelectUmamsume] = useState(umamusume);

    //オートモードチェック処理
    const handleAutoModeChange = () => {
        setIsAutoMode(!isAutoMode);
    };

    //出走処理ボタン
    const handleRunRace = (raceId : number) => {
        raceRunRegist(raceId);
    };

    useEffect(() => {
        fetchRemainingRaces();
    },[]);

    //日程が変更された時にレース情報を取得する
    useEffect(() => {
        if(selectedSeason == 1 && selectedMonth <= 7){
            setIsRaceReturn(false);
            fetchRemainingRaces();
        }else{
            setIsRaceReturn(true);
            fetchRemainingRaces();
        }
        if(selectedSeason == 3 && selectedMonth == 12 && selectedHalf == 1){
            setIsRaceForward(false);
            fetchRemainingRaces();
        }else{
            setIsRaceForward(true);
        }
      }, [selectedSeason, selectedMonth, selectedHalf]);

    //シーズン情報などからレースを取得する
    const fetchRemainingRaces = async () => {
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
              body: JSON.stringify({season:selectedSeason,month:selectedMonth,half:selectedHalf,umamusumeId:selectUmamsume?.umamusume_id}),
            });
            const responseJson = await response.json();
            const data :Race[] = responseJson.data;
            const props = responseJson.Props;
            setSelectedSeason(props.season);
            setSelectedMonth(props.month);
            setSelectedHalf(props.half);
            setIsRaceReturn(props.isRaceReturn);
            setIsRaceForward(props.isRaceForward);
            setRaces(data);
          } catch (error) {
            console.error("Failed to fetch races:", error);
          }
    };

    //レース出走処理
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
        }else{
            fetchRemainingRaces();
        }
    };

    //前へボタン処理
    const raceReturn = () =>{
        let isHalf = selectedHalf == 1 ? 0 : 1;
        let isMunth = selectedMonth;
        let isSeason = selectedSeason;
        if(!selectedHalf){
            isMunth = selectedMonth - 1
            if(selectedMonth == 1){
                isMunth = 12;
                if(selectedSeason > 1){
                    isSeason = selectedSeason - 1;
                }
            }
        }
        setSelectedMonth(isMunth);
        setSelectedHalf(isHalf);
        setSelectedSeason(isSeason);
    }

    //次へボタン処理
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

    //画面終了処理
    const handleReturn = () => {
        onReturn();
    }
  
    return (
        <div className="min-h-screen flex flex-col items-center p-6">
            <div className="text-center text-2xl font-bold text-black my-6">
                {selectUmamsume?.umamusume_name}
            </div>
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
        
            <select
                className="border border-gray-300 rounded p-2"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
                {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                    {i + 1}月
                </option>
                ))}
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
        
        <div className="relative h-[600px]">
            <table className="table-fixed w-full border-collapse border border-gray-300 mb-6">
                <RemainingRaceListManualHeader>
                </RemainingRaceListManualHeader>
                <tbody>
                {races.map((race) => (
                    <RemainingRaceListItem
                    key={race.race_id}
                    race={race}
                    runRace={handleRunRace}
                    />
                ))}
                </tbody>
            </table>
        
            <div className="absolute top-full w-full flex justify-center mt-4">
                <div className="flex justify-between w-full max-w-[600px]">
                    <div>
                    {isRaceReturn ? (
                    <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-xl"
                    onClick={raceReturn}
                    >
                    前へ
                    </button>
                    ) : (
                    <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-xl"
                    onClick={handleReturn}
                    >
                    戻る
                    </button>
                    )}
                    </div>

                    <div>
                    {isRaceForward ? (
                    <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl"
                    onClick={raceForward}
                    >
                    次へ
                    </button>
                    ) : (
                    <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-xl"
                    onClick={handleReturn}
                    >
                    戻る
                    </button>
                    )}
                    </div>
                </div>
            </div>
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
          <div className="text-gray-700 text-center mt-8">
            オートモードがオンの場合、出走後自動的に次の時期に進みます。
          </div>
        )}
      </div>
      
    );
};
