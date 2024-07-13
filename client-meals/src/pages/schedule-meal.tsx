import React from 'react'
import ScheduleMealTable from '../component/table/ScheduleMealTable'
import ComponentTitle from '../component/component-title/ComponentTitle'

const ScheduleMeal = () => {
  return (
    <>
    <ComponentTitle pageName="Schedule" button="add" link="/add-meal"/>
     <ScheduleMealTable />
   </>
  )
}

export default ScheduleMeal