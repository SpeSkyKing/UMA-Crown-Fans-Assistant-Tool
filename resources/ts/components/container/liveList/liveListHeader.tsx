import { Header } from "../../common/header";

//ヘッダーに表示する情報を定義する
const LiveListHeaderItem = [
    {display:'曲名'}
  ];

//ライブ情報表示画面のヘッダー情報
export const LiveListHeader = () => {
    return (
        <Header ItemArray={LiveListHeaderItem} />
    );
};
