import { Header } from "../../common/header";

//ヘッダーに表示する情報を定義する
const remainingRaceListManualHeaderItem = [
    {display:'レース名'},
    {display:'馬場'},
    {display:'距離'},
    {display:'別判定'},
    {display:'出走'}
  ];

export const RemainingRaceListManualHeader = () => {
    return (
        <Header ItemArray={remainingRaceListManualHeaderItem} />
    );
};