import { useState } from "react";
import { InputField } from '../common/inputField';
import { RegistProps } from '../interface/props';

//ユーザー情報を登録する画面
export const Regist :React.FC<RegistProps> = ({onReturn,onRegist}) => {
    
    // ユーザーの名前
    const [ userName, setUserName ] = useState("");

    // パスワード
    const [ password, setPassword ] = useState("");

    // Eメールアドレス
    const [ email, setEmail ] = useState("");

    // 電話番号
    const [ phone, setPhone ] = useState("");

    // ユーザーイメージ画像
    const [ avatar, setAvatar ] = useState<File | null>(null);

    // 誕生日
    const [ birthday, setBirthday ] = useState("");

    // ユーザーの名前
    const [ gender, setGender ] = useState("2");

    // ユーザーの名前
    const [ address, setAddress ] = useState("");

    // ユーザーの名前
    const [ country, setCountry ] = useState("");

    // ユーザーの名前
    const [ role, setRole ] = useState("0");

    //親画面に画面の終了を通知する
    const handleReturn = () =>{
        onReturn();
    } 

    //ユーザー情報をサーバー側へ送信する
    const handleRegist = async ()  => {
        if (userName && password) {
            const formData = new FormData();
            if (avatar) {
                formData.append("avatar", avatar);
            }
            formData.append("userName", userName);
            formData.append("password", password);
            formData.append("email", email);
            formData.append("phone", phone);
            formData.append("birthday", birthday);
            formData.append("gender", gender);
            formData.append("address", address);
            formData.append("country", country);
            formData.append("role", role);
        try {
                const response = await fetch("/api/user/regist", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error("ユーザーの登録に失敗しました");
                }
                const data = await response.json();
                onRegist(userName, password);
                alert("登録が完了しました！");
                } catch (error) {
                    alert("エラーが発生しました。");
            }
        } else {
            alert("ユーザーIDとパスワードを入力してください。");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-center mb-6 text-white">新規登録</h2>
            <div className="p-4">
            <InputField
                id="userName"
                label="ユーザー名"
                type="text"
                value={userName}
                placeholder="ユーザー名を入力してください"
                onChange={(e) => setUserName(e.target.value)}/>
            <InputField
                id="email"
                label="メールアドレス"
                type="email"
                value={email}
                placeholder="メールアドレスを入力してください"
                onChange={(e) => setEmail(e.target.value)}/>
            <InputField
                id="phone"
                label="電話番号"
                type="tel"
                value={phone}
                placeholder="電話番号を入力してください"
                onChange={(e) => setPhone(e.target.value)}/>
            <div className="mb-4">
                <label htmlFor="avatar" className="block text-sm font-medium text-white">
                    アバター画像
                </label>
                <input
                    id="avatar"
                    type="file"
                    className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                    placeholder="画像を選択してください"
                    onChange={(e) => setAvatar(e.target.files ? e.target.files[0] : null)}
                    accept="image/*"
                />
            </div>
            <InputField
                id="birthday"
                label="誕生日"
                type="date"
                value={birthday}
                placeholder="誕生日を入力してください"
                onChange={(e) => setBirthday(e.target.value)}/>
            <div className="mb-4">
                <label htmlFor="gender" className="block text-sm font-medium text-white">
                性別
                </label>
                <select
                id="gender"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                >
                <option value="2">未設定</option>
                <option value="1">男</option>
                <option value="0">女</option>
                </select>
            </div>
            <InputField
                id="address"
                label="住所"
                type="text"
                value={address}
                placeholder="住所を入力してください"
                onChange={(e) => setAddress(e.target.value)}/>
            <InputField
                id="country"
                label="国"
                type="text"
                value={country}
                placeholder="国を入力してください"
                onChange={(e) => setCountry(e.target.value)}/>
            <div className="mb-4">
                <label htmlFor="role" className="block text-sm font-medium text-white">
                役割
                </label>
                <select
                id="role"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                >
                <option value="1">管理者</option>
                <option value="0">使用者</option>
                </select>
            </div>
            <InputField
                id="password"
                label="パスワード"
                type="password"
                value={password}
                placeholder="パスワードを入力してください"
                onChange={(e) => setPassword(e.target.value)}/>
            </div>

            <button
                className="w-full px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none"
                onClick={handleRegist}>
                新規登録
            </button>
            <button
                className="w-full px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none mt-8"
                onClick={handleReturn}>
                戻る
            </button>
        </div>
    );
};
