import { Header } from "../../common/header";

//ヘッダーに表示する情報を定義する
const ActerListHeaderItem = [
    {display:'担当ウマ娘'},
    {display:'名前'},
    {display:'愛称'},
    {display:'年齢'},
  ];

//声優情報表示画面のヘッダー情報
export const ActerListHeader = () => {
    return (
        <Header ItemArray={ActerListHeaderItem} />
    );
};
