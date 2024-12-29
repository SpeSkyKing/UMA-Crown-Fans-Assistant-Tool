import React, { useState,useEffect} from 'react';
import {Race} from '../../interface/Interface';
import {RaceListHeader} from '../raceList/raceListHeader';
import {RaceListdata} from '../raceList/raceListdata';

export const CharacterRegist = () => {

    const [races, setRaces] = useState<Race[]>([]);
    
        useEffect(() => {
            const fetchRaces = async () => {
                try {
                  const response = await fetch("/api/race/registList");
                  const responseJson = await response.json();
                  const data :Race[] = responseJson.data;
                  setRaces(data);
                } catch (error) {
                  console.error("Failed to fetch races:", error);
                } finally {
                }
              }
              fetchRaces();
        },[]);
    
     

  // 固定値としてキャラクター情報を設定
  const characters = [
    { id: 1, name: 'マチカネフクキタル',img:`/storage/image/SidebarTab/SpecialWeek.png`},
    { id: 2, name: 'スペシャルウィーク',img:`/storage/image/SidebarTab/SpecialWeek.png`},
    { id: 3, name: 'キングヘイロー',img:`/storage/image/SidebarTab/SpecialWeek.png`},
  ];

  // 固定値として選択したキャラクターを設定
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0]);

  // 固定値としてレース結果
  const raceResults = [
    { name: 'レース1', rank: '1位', date: '2024/01/01' },
    { name: 'レース2', rank: '2位', date: '2024/02/01' },
    { name: 'レース3', rank: '3位', date: '2024/03/01' },
  ];

  return (
    <div className="min-h-full">
    <div className="w-full max-w-10xl rounded-lg p-6 shadow-lg relative">
      <div className="w-full bg-white/50 rounded-lg shadow-lg overflow-auto p-4 scrollbar-hide">
        
        <div className="flex gap-4 mb-6 sticky top-0 bg-white/50 z-10 p-4">
          <div className="w-1/2 h-96 flex-none rounded-full overflow-hidden shadow-lg">
            <img alt={selectedCharacter.name} src={selectedCharacter.img} className="w-full h-full object-cover" />
          </div>
  
          <div className="w-1/2 h-96 flex-grow flex flex-col justify-center">
            <h2 className="text-2xl font-semibold">{selectedCharacter.name}</h2>
            <select 
              className="mt-2 p-2 border rounded"
              value={selectedCharacter.id}
              onChange={(e) => setSelectedCharacter(characters.find(c => c.id === parseInt(e.target.value)))}
            >
              {characters.map(character => (
                <option key={character.id} value={character.id}>
                  {character.name}
                </option>
              ))}
            </select>
          </div>
        </div>
  
        <div className="mt-6">
            <div className="overflow-y-auto max-h-[calc(100vh-22rem)] h-96">
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <RaceListHeader />
                <tbody>
                    {races.map((race) => (
                    <RaceListdata race={race} key={race.id} />
                    ))}
                </tbody>
                </table>
            </div>

  
          <div className="mt-6 flex justify-center">
            <button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 px-8 rounded-full shadow-lg hover:bg-gradient-to-l transform hover:scale-105 transition-all duration-300">
              登録
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default CharacterRegist;
        