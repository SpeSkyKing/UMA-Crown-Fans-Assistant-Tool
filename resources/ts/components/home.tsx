import {useState,useEffect} from 'react';
import {Sidebar} from './layout/sidebar';
import {Content} from './layout/content';
import {Auth} from './common/auth';
import {Regist} from './common/regist';
import {User} from './interface/interface';

export const Home = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [selectedContent, setSelectedContent] = useState("characterRegist");
    const [isRegistering, setIsRegistering] = useState(false);
    const [userName, setUserName] = useState('');
    const token = localStorage.getItem("auth_token");

    useEffect(() => {
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        const getUserName = async () => {
            const token = localStorage.getItem('auth_token');
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
        getUserName();
    }, []);
    

    const handleLogin = (user_name: string, password: string) => {
        if (user_name && password) {
            fetch("/api/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_name: user_name, password: password }),
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === "ログイン成功") {
                    localStorage.setItem("auth_token", data.token);
                    setIsAuthenticated(true);
                }
            })
            .catch((error) => {
                console.error("ログインリクエストエラー:", error);
            });
        }
    };



    const handleRegist = (user_name: string, password: string) => {
        setIsRegistering(false);
        handleLogin(user_name, password);
    };

    const newRegist = () =>{
        setIsRegistering(true);
    };

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
      
    if (!isAuthenticated) {
        if (isRegistering) {
            return (
                <Regist
                    onRegist={handleRegist}
                />
            );
        } else {
            return (
                <Auth
                    onLogin={handleLogin} onRegist={newRegist}
                />
            );
        }
    }
    return (
<div className="flex h-full" style={{ backgroundImage: `url(/storage/image/backgroundFile/${selectedContent}.PNG)`, backgroundSize: 'cover', backgroundPosition: 'center' }} >
    <div className="!w-4/5">
        <Content selectedContent={selectedContent} />
    </div>

    <div className="relative flex flex-col w-1/5 bg-umamusume-side bg-cover overflow-hidden bg-white/50">
        {isAuthenticated && (
            <div className=" text-white flex flex-col items-center justify-center w-full space-y-4">
                <div
                    className={`block w-full text-center text-2xl font-bold py-4 rounded-xl border-2 border-gray-300 
                    bg-transparent text-purple-500 transition-all duration-300 hover:bg-pink-200 bg-[30%_30%]
                    hover:text-white hover:scale-105 hover:shadow-lg active:bg-pink-300 mb-4 bg-userName bg-cover`}
                >
                    <div className="font-bold text-pink text-2xl w-full text-center">
                        {userName}
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className={`block w-full text-center text-2xl font-bold py-4 rounded-xl border-2 border-gray-300 
                    bg-transparent text-purple-500 transition-all duration-300 hover:bg-pink-200 bg-center
                    hover:text-white hover:scale-105 hover:shadow-lg active:bg-pink-300 mb- bg-Logout bg-cover`}
                >
                    ログアウト
                </button>
            </div>
        )}
        <Sidebar onTabClick={setSelectedContent} />
    </div>
</div>


    );
}