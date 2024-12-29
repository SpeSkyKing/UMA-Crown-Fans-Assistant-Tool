import { Header } from "../../common/header";

const ActerListHeaderItem = [
    {display:'担当ウマ娘'},
    {display:'名前'},
    {display:'愛称'},
    {display:'年齢'},
  ];

export const ActerListHeader = () => {
    return (
        <Header ItemArray={ActerListHeaderItem}></Header>
    );
};
