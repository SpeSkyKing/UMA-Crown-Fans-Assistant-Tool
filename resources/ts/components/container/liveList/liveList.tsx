import { useState , useEffect } from 'react';
import { Live,Umamusume } from '../../interface/interface';
import { LiveListHeader } from './liveListHeader';
import { LiveListData } from './liveListData';
import { LiveListCharacterHeader } from './liveListCharacterHeader';
import { LiveListCharacterData } from './liveListCharacterData';
import { LiveListProps } from '../../interface/props';

//ライブ情報表示画面
export const LiveList : React.FC<LiveListProps> = ({token}) => {

    //ライブ情報を格納する配列
    const [lives, setLives] = useState<Live[]>([]);
    
    //選択したライブ情報を格納する
    const [selectLive,setSelectLive] = useState<Live>();
    
    //対象のライブ情報に紐づくウマ娘を格納する
    const [umamusumes, setUmamusumes] = useState<Umamusume[]>([]);
    
    //ローディング画面
    const [loading,setLoading] = useState(true);
    
    //ライブを選択している状態
    const [isCharacter,setIsCharacter] = useState(false);

    //ライブを選択した処理
    const onClick = (live : Live) =>{
      setSelectLive(live);
      fetchUmamusumes(live);
      setIsCharacter(true);
    }

    //ライブ選択後戻るボタンを選択した処理
    const onReturn = () => {
      setIsCharacter(false);
    }

    useEffect(() => {
          fetchlives();
    },[]);

    //ライブに紐づくウマ娘を取得する処理
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

    //ライブ情報を取得する処理
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
