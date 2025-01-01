import { Header } from "../../common/header";

const raceListHeaderItem = [
    {display:'名前'},
    {display:'ファン数'},
    {display:'芝'},
    {display:'ダート'},
    {display:'短距離'},
    {display:'マイル'},
    {display:'中距離'},
    {display:'長距離'},
    {display:'逃げ'},
    {display:'先行'},
    {display:'差し'},
    {display:'追込'}
  ];

export const CharacterListHeader = () => {
    return (
        <Header ItemArray={raceListHeaderItem} />
    );
};
