import { useState } from "react";

export const Regist = ({ onRegist }: { onRegist: (user_id: string, password: string) => void }) => {
    const [user_id, setuser_id] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [avatar, setAvatar] = useState("");
    const [birthday, setBirthday] = useState("");
    const [gender, setGender] = useState("2");
    const [address, setAddress] = useState("");
    const [country, setCountry] = useState("");
    const [role, setRole] = useState("0");

    const handleRegist = async ()  => {
        if (user_id && password) {
        try {
            const response = await fetch("/api/userRegist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id, password ,email , phone ,avatar ,birthday ,gender ,address ,country ,role}),
            });

            if (!response.ok) {
                throw new Error("ユーザーの登録に失敗しました");
            }


            const data = await response.json();
            onRegist(user_id, password);
            alert("登録が完了しました！");
        } catch (error) {

        } finally {

        }
        } else {
            alert("ユーザーIDとパスワードを入力してください。");
        }
    };

    return (
        <div
    className="flex h-screen items-center justify-center bg-gradient-to-br"
    style={{
        backgroundImage: 'url(/storage/image/backgroundFile/Login-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }}
>
    <div className="p-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-lg w-96 max-h-[90%] overflow-y-auto my-8 scrollbar-hide">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">新規登録</h2>

        <div className="mb-4">
            <label htmlFor="user_id" className="block text-sm font-medium text-white">
                ユーザーID
            </label>
            <input
                id="user_id"
                type="text"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                placeholder="ユーザーIDを入力してください"
                value={user_id}
                onChange={(e) => setuser_id(e.target.value)}
            />
        </div>

        <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-white">
                メールアドレス
            </label>
            <input
                id="email"
                type="email"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                placeholder="メールアドレスを入力してください"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
        </div>

        <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-white">
                電話番号
            </label>
            <input
                id="phone"
                type="tel"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                placeholder="電話番号を入力してください"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
        </div>

        <div className="mb-4">
            <label htmlFor="avatar" className="block text-sm font-medium text-white">
                アバター画像
            </label>
            <input
                id="avatar"
                type="file"
                accept="image/*"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                onChange={(e) => setAvatar(e.target.files[0])}
            />
        </div>

        <div className="mb-4">
            <label htmlFor="birthday" className="block text-sm font-medium text-white">
                誕生日
            </label>
            <input
                id="birthday"
                type="date"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
            />
        </div>

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

        <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-white">
                住所
            </label>
            <input
                id="address"
                type="text"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                placeholder="住所を入力してください"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />
        </div>

        <div className="mb-4">
            <label htmlFor="country" className="block text-sm font-medium text-white">
                国
            </label>
            <input
                id="country"
                type="text"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                placeholder="国を入力してください"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
            />
        </div>

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

        <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-white">
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
            className="w-full px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none"
            onClick={handleRegist}
        >
            新規登録
        </button>
        </div>
    </div>

    );
};
