import React, { useState } from "react";
import {InputField} from '../common/inputField';
import {PasswordForgetProps} from '../interface/props';

export const PasswordForget: React.FC<PasswordForgetProps> = ({ onReturn }) => {
  const [email, setEmail] = useState<string>("");

  const handleReturn = () => {
    onReturn();
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert("メールアドレスを入力してください");
      return;
    }

    try {
      const response = await fetch("https://your-laravel-api-endpoint.com/password-forget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("メールが送信されました。");
        handleReturn();
      } else {
        alert(data.message || "エラーが発生しました");
      }
    } catch (error) {
      console.error("APIエラー:", error);
      alert("通信エラーが発生しました");
    }
  };

  return (
    <div className="password-forget">
      <h2>パスワード忘れ</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <InputField
            id="email"
            label="メールアドレスを入力"
            type="email"
            value={email}
            placeholder="画像を選択してください"
            onChange={(handleEmailChange)}/>
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none hover:bg-blue-600"
          >
            メール送信
          </button>
          <button
            type="button"
            onClick={handleReturn}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg focus:outline-none hover:bg-gray-600"
          >
            戻る
          </button>
        </div>
      </form>
    </div>
  );
};
