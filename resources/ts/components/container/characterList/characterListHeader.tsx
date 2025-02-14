import { Header } from "../../common/header";

//ヘッダーに表示する情報を定義する
const raceListHeaderItem = [
    {display:'名前'},
    {display:'芝'},
    {display:'ダート'},
    {display:'短距離'},
    {display:'マイル'},
    {display:'中距離'},
    {display:'長距離'},
    {display:'逃げ'},
    {display:'先行'},
    {display:'差し'},
    {display:'追込'},
    {display:'名手'},
    {display:'ファン数'},
    {display:'ファン'}
  ];

export const CharacterListHeader = () => {
    return (
        <Header ItemArray={raceListHeaderItem} />
    );
};
