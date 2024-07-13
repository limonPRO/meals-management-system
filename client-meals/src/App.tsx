import { useEffect, useState } from 'react'
import './App.css'
import DefaultLayout from './layout/DefaultLayout';
import { Route, Routes, useLocation } from 'react-router-dom';
import Item from './pages/Item';
import AddItems from './pages/add-item';
import User from './pages/user';
import AddUsers from './pages/add-user';
import MealTable from './component/table/MealTable';
import Meal from './pages/meal';
import AddMeal from './pages/add-meal';
import ScheduleMealTable from './component/table/ScheduleMealTable';
import ScheduleMeal from './pages/schedule-meal';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
   <p>loading ...</p>
  ) : (
    <DefaultLayout>
      <Routes>
        <Route
          index
          element={
            <>
              {/* <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" /> */}
              {/* <ECommerce /> */}
            </>
          }
        />
          <Route
          path="/item"
          element={
            <>
              <Item /> 
            </>
          }
        />
         <Route
          path="/add-item"
          element={
            <>
              <AddItems /> 
            </>
          }
        />
                 <Route
          path="/users"
          element={
            <>
              <User /> 
            </>
          }
        />
        <Route
          path="/add-user"
          element={
            <>
              <AddUsers /> 
            </>
          }
        />
          <Route
          path="/meal"
          element={
            <>
              <Meal /> 
            </>
          }
        />
        <Route
          path="/add-meal"
          element={
            <>
              <AddMeal /> 
            </>
          }
        />
         <Route
          path="/schedule-meal"
          element={
            <>
              <ScheduleMeal /> 
            </>
          }
        />
      </Routes>

    </DefaultLayout>
  );
  
}

export default App
