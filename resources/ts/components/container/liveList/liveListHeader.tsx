import { Header } from "../../common/header";

const LiveListHeaderItem = [
    {display:'曲名'}
  ];

export const LiveListHeader = () => {
    return (
        <Header ItemArray={LiveListHeaderItem}></Header>
    );
};
