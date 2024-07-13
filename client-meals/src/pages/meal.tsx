
import ComponentTitle from '../component/component-title/ComponentTitle'
import MealTable from '../component/table/MealTable'

const Meal = () => {
  return (
    <>
          <ComponentTitle pageName="Meal" button="add" link="/add-meal"/>
        
          <MealTable />
    </>
  )
}

export default Meal