import { useState , useEffect ,useRef} from 'react';
import React from 'react';
import { JewelControllerProps } from '../../interface/props';
import { JewelControllerCalendar, JewelControllerCalendarHandle } from './jewelControllerCalendar';

//ジュエル情報管理画面
export const JewelController : React.FC<JewelControllerProps> = ({token}) => {

      const calendarRef = useRef<JewelControllerCalendarHandle>(null);

      //選択年
      const [year, setYear] = useState<number>(2025);
      
      //選択月
      const [month, setMonth] = useState<number>(3);

      //ジュエル数
      const [dayJewel, setDayJewel] = useState<number>(0);
    
      //年変更イベント
      const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setYear(Number(e.target.value));
      };

      //月変更イベント
      const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMonth(Number(e.target.value));
      };

      //本日分登録用入力処理
      const handleJewelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value)) {
          setDayJewel(value);
        }
      }

      const handleFetch = () => {
        calendarRef.current?.fetchJewelData();
      };

      //ジュエル登録処理
      const jewelRegist = async () => {
        try {
          if (!token) {
              console.error('トークンが見つかりません');
              return;
          }
          const response = await fetch("/api/jewelController/regist", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({jewel:dayJewel}),
          });

          if (!response.ok) {
              throw new Error("ジュエルの登録に失敗しました");
          }
          const data = await response.json();
          setDayJewel(0);
          handleFetch();
        } catch (error) {
            alert('登録できませんでした');
        }
      }
      
      //API取得中の状態を表示する判定
      const [loading,setLoading] = useState(false);
  
      if (loading) {
          return <div className="min-h-full flex justify-center bg-Looding bg-cover"></div>
      }

      return (
        <div className="p-8 flex flex-col items-center">
          {/* 年月セレクトを中央に配置 */}
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
          </div>

          {/* カレンダー部分 */}
          <JewelControllerCalendar year={year} month={month} token={token}/>

          <div className="mt-6 flex justify-center items-center space-x-4">
            <label htmlFor="fans" className="text-xl text-pink-600 font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
              ジュエル数
            </label>
            <input
              id="fans"
              type="number"
              className="p-2 border rounded-lg shadow-md mr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right"  // text-rightで数字を右寄せ
              value={dayJewel}
              onChange={handleJewelChange}
              placeholder="ジュエル数"
              style={{
                fontFamily: 'Dancing Script, cursive',
                fontSize: '1.2rem',
              }}
            />
            <button
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 px-8 rounded-full shadow-lg hover:bg-gradient-to-l transform hover:scale-105 transition-all duration-300"
              onClick={jewelRegist}
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '1.2rem',
              }}
              >
              登録
            </button>
          </div>
        </div>
      )
};