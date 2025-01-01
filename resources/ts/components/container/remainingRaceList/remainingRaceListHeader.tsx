import { Header } from "../../common/header";

const remainingRaceListHeaderItem = [
    {display:'出走処理'},
    {display:'ウマ娘名'},
    {display:'総数'},
    {display:'芝・短距離'},
    {display:'芝・マイル'},
    {display:'芝・中距離'},
    {display:'芝・長距離'},
    {display:'ダート・短距離'},
    {display:'ダート・マイル'},
    {display:'ダート・中距離'}
  ];

export const RemainingRaceListHeader = () => {
    return (
        <Header ItemArray={remainingRaceListHeaderItem} />
    );
};
