import { Header } from "../../common/header";

const remainingRaceListHeaderItem = [
    {display:'出走処理'},
    {display:'ウマ娘名'},
    {display:'総数'},
    {display:'短距離'},
    {display:'マイル'},
    {display:'中距離'},
    {display:'長距離'},
    {display:'短距離'},
    {display:'マイル'},
    {display:'中距離'}
  ];

export const RemainingRaceListHeader = () => {
    return (
        <Header ItemArray={remainingRaceListHeaderItem} />
    );
};
