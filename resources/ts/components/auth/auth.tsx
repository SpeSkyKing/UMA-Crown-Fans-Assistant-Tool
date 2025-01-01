import { useState } from "react";
import { Regist } from './regist';
import { PasswordForget } from './passwordForget';
import {InputField} from '../common/inputField';
import {AuthProps} from '../interface/props';
export const Auth: React.FC<AuthProps>  = ({onLogin}) => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordForget,setPasswordForget] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const token = localStorage.getItem("auth_token");

    const handleLogin = () => {
        if (userName && password) {
            fetch("/api/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userName: userName, password: password }),
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === "ログイン成功") {
                    localStorage.setItem("auth_token", data.token);
                    onLogin();
                }
            })
            .catch((error) => {
                alert("ログインできませんでした。");
            });
        }else{
            alert("ユーザーネームとパスワードを入力してください");
        }
    };

    const handleRegist = (userName: string, password: string) => {
        setIsRegistering(false);
        setUserName(userName);
        setPassword(password);
        handleLogin();
    };

    const newRegist = () =>{
        setIsRegistering(true);
    };

    const handlePasswordForget = () =>{
        setPasswordForget(true);
    }

    const handleTop = () =>{
        setIsRegistering(false);
        setPasswordForget(false);
    }


    if (passwordForget){
        return <PasswordForget onReturn={handleTop}></PasswordForget>
    }

    if (isRegistering) {
        return <Regist onRegist={handleRegist} onReturn={handleTop}></Regist>
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">ログイン</h2>

            <div className="mb-4">
                <InputField
                    id="user_name"
                    label="ユーザー名"
                    type="text"
                    value={userName}
                    placeholder="ユーザー名を入力してください"
                    onChange={(e) => setUserName(e.target.value)}
                />

            </div>

            <div className="mb-6">
                <InputField
                    id="password"
                    label="パスワード"
                    type="password"
                    value={password}
                    placeholder="パスワードを入力してください"
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
                <a className="text-sm text-blue-500 hover:underline" onClick={handlePasswordForget}>
                    パスワードを忘れた場合
                </a>
            </div>

            <div className="text-center mt-2">
                <a className="text-sm text-blue-500 hover:underline" onClick={newRegist}>
                    新規登録
                </a>
            </div>
        </div>
    );
};