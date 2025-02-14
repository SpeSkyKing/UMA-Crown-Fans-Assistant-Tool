import { Header } from "../../common/header";

//ヘッダーに表示する情報を定義する
const raceListHeaderItem = [
    {display:'出走済'},
    {display:'レース名'},
    {display:'クラス'},
    {display:'馬場'},
    {display:'距離'},
    {display:'出走時期'},
    {display:'月'}
  ];

export const CharacterRegistHeader = () => {
    return (
        <Header ItemArray={raceListHeaderItem} />
    );
};
