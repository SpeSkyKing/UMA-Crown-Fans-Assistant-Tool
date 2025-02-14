import { Header } from "../../common/header";

//ヘッダーに表示する情報を定義する
const LiveListHeaderItem = [
    {display:'曲名'}
  ];

export const LiveListHeader = () => {
    return (
        <Header ItemArray={LiveListHeaderItem} />
    );
};
