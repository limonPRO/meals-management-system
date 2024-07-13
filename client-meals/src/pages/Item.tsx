import ComponentTitle from "../component/component-title/ComponentTitle";
import Table from "../component/table/Table";

const Item = () => {
  return (
    <>
     <ComponentTitle pageName="Items" button="add" link="/add-item"/>
      <Table />
    </>
  );
};

export default Item;
