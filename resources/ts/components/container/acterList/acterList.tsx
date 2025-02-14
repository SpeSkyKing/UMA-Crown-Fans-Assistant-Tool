import { useState , useEffect } from 'react';
import { ActerListHeader } from './acterListHeader';
import { ActerListData } from './acterListData';
import { Acter } from '../../interface/interface';

//声優情報表示画面
export const ActerList = () => {

      //声優情報を格納する配列
      const [acters, setActers] = useState<Acter[]>([]);

      //情報を取得中か判定する変数
      const [loading,setLoading] = useState(true);
      
      //声優情報を取得する
      const fetchActers = async () => {
        try {
          const response = await fetch("/api/acter/acterlist");
          const responseJson = await response.json();
          const data :Acter[] = responseJson.data;
          setActers(data);
        } catch (error) {
          console.error("Failed to fetch races:", error);
        } finally {
          setLoading(false);
        }
      }

      useEffect(() => {
            fetchActers();
      },[]);
  
      if (loading) {
          return <div className="min-h-full flex justify-center bg-Looding bg-cover"></div>
      }

      return (
          <table className="table-auto w-full border-collapse border border-gray-300 ">
              <ActerListHeader></ActerListHeader>
              <tbody>
                {acters.map((acter,index) => (
                  <ActerListData key={index} acter={acter} />
                ))}
              </tbody>
          </table>
      )
};
