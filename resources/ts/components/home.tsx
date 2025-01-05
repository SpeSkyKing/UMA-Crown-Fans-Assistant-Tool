import {useState,useEffect} from 'react';
import {Sidebar} from './layout/sidebar';
import {Content} from './layout/content';
import {Auth} from './auth/auth';
import {User} from './interface/interface';

export const Home = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [selectedContent, setSelectedContent] = useState("characterRegist");
    const [userName, setUserName] = useState('');
    const token = localStorage.getItem("auth_token");

    useEffect(() => {
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        getUserName();
    }, []);

    const handleSelect = ( content:string ) => {
        setSelectedContent(content);
    }

    const handleLogin = () => {
        setIsAuthenticated(true);
    }

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

      const getUserName = async () => {
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
            setUserName(data.user_name);
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
                        className={`block w-full text-center text-2xl font-bold py-4 rounded-xl border-2 border-gray-300 
                        bg-transparent text-purple-500 transition-all duration-300 hover:bg-pink-200 bg-[30%_30%]
                        hover:text-white hover:scale-105 hover:shadow-lg active:bg-pink-300 mb-4 bg-userName bg-cover`}>
                        <div className="font-bold text-pink text-2xl w-full text-center">
                            {userName}
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