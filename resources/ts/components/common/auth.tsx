import { useState } from "react";

export const Auth = ({ onLogin ,onRegist }: { onLogin: (user_name: string, password: string) => void , onRegist:() => void}) => {
    const [user_name, setuser_name] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        if (user_name && password) {
            onLogin(user_name, password);
        } else {
            alert("ユーザー名とパスワードを入力してください。");
        }
    };

    return (
        <div
            className="flex h-screen items-center justify-center bg-gradient-to-br"
            style={{
                backgroundImage: 'url(/storage/image/backgroundFile/Login-bg.PNG)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="p-8 bg-gradient-to-r  from-green-400 to-blue-500 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">ログイン</h2>

                <div className="mb-4">
                    <label htmlFor="user_name" className="block text-sm font-medium text-gray-600">
                        ユーザー名
                    </label>
                    <input
                        id="user_name"
                        type="text"
                        className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                        placeholder="ユーザー名を入力してください"
                        value={user_name}
                        onChange={(e) => setuser_name(e.target.value)}
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                        パスワード
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                        placeholder="パスワードを入力してください"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
                    onClick={handleLogin}
                >
                    ログイン
                </button>

                <div className="text-center mt-4">
                    <a className="text-sm text-blue-500 hover:underline">
                        パスワードを忘れた場合
                    </a>
                </div>

                <div className="text-center mt-2">
                    <a className="text-sm text-blue-500 hover:underline" onClick={onRegist}>
                        新規登録
                    </a>
                </div>
            </div>
        </div>
    );
};
