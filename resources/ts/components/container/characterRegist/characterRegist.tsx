import React, { useState,useEffect } from 'react';
import { Race , Umamusume } from '../../interface/interface';
import { CharacterRegistHeader } from './characterRegistHeader';
import { CharacterRegistData } from './characterRegistData';
import { Aptitude } from './aptitude';
import { CharacterRegistProps } from '../../interface/props';

//ウマ娘登録画面
export const CharacterRegist : React.FC<CharacterRegistProps> = ({token}) => {

    //レース情報を格納する配列
    const [races, setRaces] = useState<Race[]>([]);

    //ウマ娘情報を格納する配列
    const [umamusumes,setUmamusumes] = useState<Umamusume[]>([]);

    //選択しているウマ娘情報
    const [selectedUmamusume, setSelectedUmamusume] = useState<Umamusume | undefined>();

    //登録対象のレースを格納する配列
    const [registRace,setregistRace] = useState<number[]>([]);

    //変更後のファン数を格納
    const [fans, setFans] = useState<number>(0);

    useEffect(() => {
      fetchRaces();
      fetchUmamusumes();
    },[]);

    
    useEffect(() => {
      if (umamusumes.length > 0) {
        setSelectedUmamusume(umamusumes[0]);
      }
    }, [umamusumes]);

    const fetchUmamusumes = async () => {
      try {
        if (!token) {
          console.error('トークンが見つかりません');
          return;
        }
        const response = await fetch("/api/umamusume/registList", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        const responseJson = await response.json();
        const data :Umamusume[] = responseJson.data;
        setUmamusumes(data);
      } catch (error) {
        console.error("Failed to fetch umamusumes:", error);
      } finally {
      }
    }

    const fetchRaces = async () => {
      try {
        const response = await fetch("/api/race/registList");
        const responseJson = await response.json();
        const data :Race[] = responseJson.data;
        const racesWithChecked = data.map((race) => ({
          ...race,
          checked: false,
        }));
        setRaces(racesWithChecked);
      } catch (error) {
        console.error("Failed to fetch races:", error);
      } finally {
      }
    }
    
    const handleUmamusumeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedId = parseInt(e.target.value);
      const selected = umamusumes.find(umamusume => umamusume.umamusume_id === selectedId);
      if (selected) {
        setSelectedUmamusume(selected);
      }
    };

    const umamusumeRegist = async ()  => {
      try {
          if (!token) {
              console.error('トークンが見つかりません');
              return;
          }
          const response = await fetch("/api/umamusume/regist", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({umamusumeId:selectedUmamusume?.umamusume_id,raceIdArray:registRace,fans:fans}),
          });

          if (!response.ok) {
              throw new Error("ウマ娘のレース登録に失敗しました");
          }
          const data = await response.json();
          alert(selectedUmamusume?.umamusume_name+"の登録が完了しました！");
          fetchUmamusumes();
          fetchRaces();
          setregistRace([]);
          setFans(0);
      } catch (error) {

      }
    };

    const handleCheckboxChange = (raceId: number, checked: boolean) => {
      if (checked) {
        setregistRace((prevState) => [...prevState, raceId]);
      } else {
        setregistRace((prevState) => prevState.filter((id) => id !== raceId));
      }
      setRaces((prevRaces) =>
        prevRaces.map((race) =>
          race.race_id === raceId ? { ...race, checked } : race
        )
      );
    };
  
    const handleSelectAll = () => {
      const allRaceIds = races.map((race) => race.race_id);
      setRaces((prevRaces) =>
        prevRaces.map((race) => ({ ...race, checked: true }))
      );
      setregistRace(allRaceIds);
    };

    const handleFansChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value)) {
        setFans(value);
      }
    };

  return (
      <div>
        <div className="flex gap-4 mb-6 sticky top-0 bg-white/50 z-10 p-4">
          <div className="w-1/2 h-96 flex-none rounded-full overflow-hidden shadow-lg"
          style={{ backgroundImage: `url(/storage/image/umamusumeData/${selectedUmamusume?.umamusume_name}.png)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          </div>
  
          <div className="w-1/2 h-96 flex-grow flex flex-col justify-center">
          <h2 className="text-2xl font-semibold"></h2>
          <select 
            className="mt-2 p-4 border rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:text-shadow-xl focus:ring-2 focus:ring-blue-500"
            value={selectedUmamusume?.umamusume_id}
            onChange={handleUmamusumeChange}
            style={{
              backgroundColor: '#a8d5ba',
              color: '#ff69b4',
              fontFamily: 'Dancing Script, sans-serif',
            }}
          >
            {umamusumes.map(umamusume => (
              <option 
                key={umamusume.umamusume_id} 
                value={umamusume.umamusume_id}
                className="text-xl transition-all duration-300 hover:shadow-xl"
              >
                {umamusume.umamusume_name}
              </option>
            ))}
          </select>

            <div className="flex justify-evenly items-center gap-6 mt-2">
              <Aptitude name="芝" aptitude={selectedUmamusume?.turf_aptitude} />
              <Aptitude name="ダート" aptitude={selectedUmamusume?.dirt_aptitude} />
            </div>

          <div className="flex justify-between gap-6 mt-2">
            <Aptitude name="短距離" aptitude={selectedUmamusume?.sprint_aptitude} />
            <Aptitude name="マイル" aptitude={selectedUmamusume?.mile_aptitude} />
            <Aptitude name="中距離" aptitude={selectedUmamusume?.classic_aptitude}/>
            <Aptitude name="長距離" aptitude={selectedUmamusume?.long_distance_aptitude}/>
          </div>

          <div className="flex justify-between gap-6 mt-2">
            <Aptitude name="逃げ" aptitude={selectedUmamusume?.front_runner_aptitude}/>
            <Aptitude name="先行" aptitude={selectedUmamusume?.early_foot_aptitude}/>
            <Aptitude name="差し" aptitude={selectedUmamusume?.midfield_aptitude}/>
            <Aptitude name="追込" aptitude={selectedUmamusume?.closer_aptitude}/>
          </div>
        </div>
      </div>
  
      <div className="mt-6 ml-4">
        <button
          className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600"
          onClick={handleSelectAll}>
          全出走
        </button> 
      </div>

      <div className="mt-6">
        <div className="overflow-y-auto max-h-[calc(100vh-22rem)] h-96">
            <table className="table-auto w-full border-collapse border border-gray-300">
                  <CharacterRegistHeader></CharacterRegistHeader>
              <tbody>
                  {races.map((race) => (
                  <CharacterRegistData race={race} key={race.race_id} checked={race.checked} onCheckboxChange={handleCheckboxChange} />
                  ))}
              </tbody>
            </table>
        </div>

  
        <div className="mt-6 flex justify-center items-center space-x-4">
          <label htmlFor="fans" className="text-xl text-pink-600 font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            獲得ファン数
          </label>
          <input
            id="fans"
            type="number"
            className="p-2 border rounded-lg shadow-md mr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right"  // text-rightで数字を右寄せ
            value={fans}
            onChange={handleFansChange}
            placeholder="ファン数"
            style={{
              fontFamily: 'Dancing Script, cursive',
              fontSize: '1.2rem',
            }}
          />
          <button
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 px-8 rounded-full shadow-lg hover:bg-gradient-to-l transform hover:scale-105 transition-all duration-300"
            onClick={umamusumeRegist}
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '1.2rem',
            }}
            >
            登録
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterRegist;