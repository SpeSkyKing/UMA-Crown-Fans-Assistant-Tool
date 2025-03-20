import { useState , useEffect } from 'react';
import React from 'react';
import { Jewel } from '../../interface/interface';
import { JewelControllerProps } from '../../interface/props';

//ジュエル情報管理画面
export const JewelController : React.FC<JewelControllerProps> = ({token}) => {
      const [year, setYear] = useState<number>(2025);
      const [month, setMonth] = useState<number>(3);
      const [day, setDay] = useState<number>(1);

      const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setYear(Number(e.target.value));
      };

      const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMonth(Number(e.target.value));
      };

      const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDay(Number(e.target.value));
      };

      // カレンダーの2次元配列を作る関数
      const createCalendar = (year: number, month: number) => {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const weeks: number[][] = [];
        let week: number[] = new Array(7).fill(0);

        // 開始曜日を決定
        for (let i = 0; i < startDate.getDay(); i++) {
          week[i] = 0;
        }

        for (let day = 1; day <= endDate.getDate(); day++) {
          const currentDate = new Date(year, month - 1, day);
          week[currentDate.getDay()] = day;
          if (currentDate.getDay() === 6 || day === endDate.getDate()) {
            weeks.push(week);
            week = new Array(7).fill(0);
          }
        }

        return weeks;
      };

  
      //ウマ娘の情報を格納するリスト
      const [jewels, setJewels] = useState<Jewel[]>([]);
      
      //API取得中の状態を表示する判定
      const [loading,setLoading] = useState(true);
      
      //非同期でウマ娘の情報取得処理を実行する
      useEffect(() => {
            fetchJewelData();
      },[]);

      //ユーザーが登録したウマ娘の情報を取得する
      const fetchJewelData = async () => {
        try {
          const response = await fetch("/api/umamusume/userRegist", {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${token}`,
              },
            });
          const responseJson = await response.json();
          const data :Jewel[] = responseJson.data;
          setJewels(data);
        } catch (error) {
          console.error("Failed to fetch races:", error);
        } finally {
          setLoading(false);
        }
      }
  
      if (loading) {
          return <div className="min-h-full flex justify-center bg-Looding bg-cover"></div>
      }

      return (
        <div className="p-8 flex flex-col items-center">
          {/* 年月日セレクトを中央に配置 */}
          <div className="flex gap-2 mb-8 justify-center">
            <select value={year} onChange={handleYearChange} className="border p-2 rounded text-lg">
              {[2023, 2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>{y}年</option>
              ))}
            </select>
            <select value={month} onChange={handleMonthChange} className="border p-2 rounded text-lg">
              {[...Array(12)].map((_, i) => (
                <option key={i} value={i + 1}>{i + 1}月</option>
              ))}
            </select>
            <select value={day} onChange={handleDayChange} className="border p-2 rounded text-lg">
              {[...Array(31)].map((_, i) => (
                <option key={i} value={i + 1}>{i + 1}日</option>
              ))}
            </select>
          </div>

          {/* カレンダー部分 */}
          <div className="border p-6 rounded shadow bg-gray-50 w-[400px]">
            <h2 className="text-xl mb-2 text-center">選択した日付</h2>
            <p className="text-center mb-4">{year}年 {month}月 {day}日</p>
            <h3 className="text-lg mb-2 text-center">カレンダー（{year}年{month}月）</h3>
            <table className="w-full border-collapse border border-gray-400 text-center text-sm">
              <thead>
                <tr>
                  {['日','月','火','水','木','金','土'].map((weekday) => (
                    <th key={weekday} className="border border-gray-400 p-1">{weekday}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {createCalendar(year, month).map((week, i) => (
                  <tr key={i}>
                    {week.map((date, idx) => (
                      <td
                        key={idx}
                        className={`border border-gray-300 p-1 ${date === day ? 'bg-blue-300 font-bold' : ''}`}
                      >
                        {date > 0 ? date : ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
};