import { useState , useEffect } from 'react';
import { CharacterListFans } from './characterListFans';
import { CharacterListHeader } from './characterListHeader';
import { CharacterListData } from './characterListData';
import { RegistUmamusume } from '../../interface/interface';
import { CharacterListProps } from '../../interface/props';
//ウマ娘情報表示画面
export const CharacterList : React.FC<CharacterListProps> = ({token}) => {
      //ウマ娘の情報を格納するリスト
      const [registUmamusumes, setRegistUmamusume] = useState<RegistUmamusume[]>([]);
      
      //API取得中の状態を表示する判定
      const [loading,setLoading] = useState(true);

      //ファン数に関しての情報を表示する場合の選択したウマ娘の情報を格納する
      const [selectUmamusume,SetSelectUmamusume] = useState<RegistUmamusume | undefined>(undefined);

      //設定後のファン数情報を格納する
      const [fanCount, setFanCount] = useState<number>(0);

      //ファン数入力画面の表示有無を設定する
      const [fanDisplay,isFanDisplay] = useState(false);
      
      //非同期でウマ娘の情報取得処理を実行する
      useEffect(() => {
            fetchUmamusumes();
      },[]);

      //ユーザーが登録したウマ娘の情報を取得する
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

      //対象のウマ娘のファン数を変動させるAPI
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

      //ファン数変動画面を表示する
      const handleFansUp = (registUmamusume:RegistUmamusume) => {
        SetSelectUmamusume(registUmamusume);
        isFanDisplay(true);
      }

      //ファン数を変動させる
      const countUp = (fan:number) => {
        setFanCount(fan);
      }


      //対象のウマ娘のファン数を変動させ、画面をクローズさせる
      const addFan = () => {
        fetchFanUp();
        isFanDisplay(false);
      }

      //ファン数変動画面を閉じる
      const onReturn = () => {
        isFanDisplay(false);
      }

  
      if (loading) {
          return <div className="min-h-full flex justify-center bg-Looding bg-cover"></div>
      }

      if (fanDisplay) {
        return (
          <CharacterListFans selectUmamusume={selectUmamusume} countUp={countUp} returnAddFan={addFan} returnOnReturn={onReturn}></CharacterListFans>
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
