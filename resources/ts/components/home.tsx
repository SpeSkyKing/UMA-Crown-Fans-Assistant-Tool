import { useState , useEffect } from 'react';
import { Sidebar } from './layout/sidebar';
import { Content } from './layout/content';
import { Auth } from './auth/auth';
import { User } from './interface/interface';

//エントリーポイント
export const Home = () => {

    //ログイン後か判断する
    const [ isAuthenticated, setIsAuthenticated ] = useState(false);
    
    //選択中のコンテンツ名を格納する
    const [ selectedContent, setSelectedContent ] = useState("characterRegist");
    
    //ログイン中のユーザー情報
    const [ user, setUser ] = useState<User>();
    
    //トークン情報
    const token = localStorage.getItem("auth_token");
    
    //ユーザーの表示画像
    const image = user?.user_image ? user?.user_image : "StillinLove.png";

    useEffect(() => {
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        getUserdata();
    }, []);

    //選択中のコンテンツを変更する
    const handleSelect = ( content:string ) => {
        setSelectedContent(content);
    }

    //ログイン処理
    const handleLogin = () => {
        setIsAuthenticated(true);
    }

    //ログアウト処理
    const handleLogout = async () => {
        try {
          const response = await fetch('/api/user/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
      
          if (response.ok) {
            setIsAuthenticated(false);
            localStorage.removeItem('auth_token');
          } else {
            console.error('ログアウトに失敗しました');
          }
        } catch (error) {
          console.error('ログアウト中にエラーが発生しました', error);
        }
      };

      //ユーザーデータを取得する処理
      const getUserdata = async () => {
        if (!token) {
            console.error('トークンが見つかりません');
            return;
        }
        try {
            const response = await fetch('/api/user/data', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('ユーザー情報の取得に失敗しました');
            }
            const responseJson = await response.json();
            const data: User = responseJson.data;
            setUser(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };
      
    if (!isAuthenticated) {
        return ( 
            <div
                className="flex h-screen items-center justify-center bg-gradient-to-br"
                style={{
                    backgroundImage: 'url(/storage/image/backgroundFile/Login-bg.PNG)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}>
                <div className="p-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-lg w-96 max-h-[90%] overflow-y-auto my-8 scrollbar-hide">
                        <Auth onLogin={handleLogin}></Auth> 
                </div>
            </div>
        )
    }

    return (
    <div className="flex h-full" style={{ backgroundImage: `url(/storage/image/backgroundFile/${selectedContent}.PNG)`, backgroundSize: 'cover', backgroundPosition: 'center' }} >
        <div className="!w-4/5">
            <div className="min-h-full flex justify-center">
                <div className="w-full max-w-10xl rounded-lg p-6 shadow-lg relative">
                    <div className="w-15/16 h-9/10 absolute inset-0 m-auto bg-white/50 rounded-lg shadow-lg overflow-auto p-4 scrollbar-hide">
                        <Content selectedContent={selectedContent} ></Content>
                    </div>
                </div>
            </div>
        </div>
        <div className="relative flex flex-col w-1/5 bg-umamusume-side bg-cover overflow-hidden bg-white/50">
            {isAuthenticated && (
                <div className=" text-white flex flex-col items-center justify-center w-full space-y-4">
                    <div
                        className='block w-full text-center text-2xl font-bold py-4 rounded-xl border-2 border-gray-300 
                        bg-transparent text-purple-500 transition-all duration-300 hover:bg-pink-200 bg-[30%_30%]
                        hover:text-white hover:scale-105 hover:shadow-lg active:bg-pink-300 mb-4'
                        style={{ backgroundImage: `url(/storage/image/userImage/${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        <div className="font-bold text-pink text-2xl w-full text-center">
                            {user?.user_name}
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className={`block w-full text-center text-2xl font-bold py-4 rounded-xl border-2 border-gray-300 
                        bg-transparent text-purple-500 transition-all duration-300 hover:bg-pink-200 bg-center
                        hover:text-white hover:scale-105 hover:shadow-lg active:bg-pink-300 mb- bg-Logout bg-cover`}>
                        ログアウト
                    </button>
                </div>
            )}
            <Sidebar onTabClick={handleSelect} ></Sidebar>
        </div>
    </div>


    );
}