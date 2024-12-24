import {useState,useEffect} from 'react';
import {Sidebar} from './layout/sidebar';
import {Content} from './layout/content';
import {Auth} from './common/auth';
import {Regist} from './common/regist';

export const Home = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [selectedContent, setSelectedContent] = useState("characterRegist");
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('管理者');

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (user_id: string, password: string) => {
        if (user_id && password) {
            fetch("/api/userLogin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id: user_id, password: password }),
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === "ログイン成功") {
                    localStorage.setItem("auth_token", data.token);
                    setIsAuthenticated(true);
                    console.log("ログイン成功:", user_id);
                } else {
                    console.log("ログイン失敗");
                }
            })
            .catch((error) => {
                console.error("ログインリクエストエラー:", error);
            });
        }
    };


    const handleRegist = (user_id: string, password: string) => {
        setIsRegistering(false);
        handleLogin(user_id, password);
    };

    const newRegist = () =>{
        setIsRegistering(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
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
        {/* ユーザー名とログアウトボタン */}
        {isAuthenticated && (
            <div className=" text-white flex flex-col items-center justify-center w-full space-y-4">
                {/* ユーザー名 */}
                <div
                    className={`block w-full text-center text-2xl font-bold py-4 rounded-xl border-2 border-gray-300 
                    bg-transparent text-purple-500 transition-all duration-300 hover:bg-pink-200 bg-[30%_30%]
                    hover:text-white hover:scale-105 hover:shadow-lg active:bg-pink-300 mb-4 bg-userName bg-cover`}
                >
                    <div className="font-bold text-pink text-2xl w-full text-center">
                        {username}
                    </div>
                </div>

                {/* ログアウトボタン */}
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

        {/* サイドバーのコンテンツ（タブなど） */}
        <Sidebar onTabClick={setSelectedContent} />
    </div>
</div>


    );
}