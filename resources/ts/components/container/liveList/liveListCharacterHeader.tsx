import { Header } from "../../common/header";

//ヘッダーに表示する情報を定義する
const LiveListCharacterHeaderItem = [
    {display:'歌唱ウマ娘'}
  ];

export const LiveListCharacterHeader = () => {
    return (
        <Header ItemArray={LiveListCharacterHeaderItem} />
    );
};
