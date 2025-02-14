import { Header } from "../../common/header";

//ヘッダーに表示する情報を定義する
const raceListHeaderItem = [
    {display:'レース名'},
    {display:'クラス'},
    {display:'馬場'},
    {display:'距離'},
    {display:'獲得ファン数最小値'},
    {display:'獲得ファン数最大値'},
    {display:'出走時期'},
    {display:'月'}
  ];

export const RaceListHeader = () => {
    return (
        <Header ItemArray={raceListHeaderItem} />
    );
};
