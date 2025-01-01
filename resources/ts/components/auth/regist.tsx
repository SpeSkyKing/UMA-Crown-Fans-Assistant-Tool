import { useState } from "react";
import {InputField} from '../common/inputField';
import {RegistProps} from '../interface/props';
export const Regist :React.FC<RegistProps> = ({onReturn,onRegist}) => {
    const [Username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [avatar, setAvatar] = useState("");
    const [birthday, setBirthday] = useState("");
    const [gender, setGender] = useState("2");
    const [address, setAddress] = useState("");
    const [country, setCountry] = useState("");
    const [role, setRole] = useState("0");

    const handleReturn = () =>{
        onReturn();
    } 

    const handleRegist = async ()  => {
        if (Username && password) {
        try {
            const response = await fetch("/api/user/regist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ Username, password ,email , phone ,avatar ,birthday ,gender ,address ,country ,role}),
            });

            if (!response.ok) {
                throw new Error("ユーザーの登録に失敗しました");
            }


            const data = await response.json();
            onRegist(Username, password);
            alert("登録が完了しました！");
        } catch (error) {

        } finally {

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
                id="Username"
                label="ユーザー名"
                type="text"
                value={Username}
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
            <InputField
                id="avatar"
                label="アバター画像"
                type="file"
                value={avatar ? avatar.name : ''}
                placeholder="画像を選択してください"
                onChange={(e) => setAvatar(e.target.files ? e.target.files[0] : null)}
                accept="image/*"/>
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
