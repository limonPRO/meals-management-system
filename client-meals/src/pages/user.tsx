import React from 'react'
import ComponentTitle from '../component/component-title/ComponentTitle'
import Table from '../component/table/Table'
import UserTable from '../component/table/UserTable'

const User = () => {
  return (
    <>
    <ComponentTitle pageName="Users" button="add" link="/add-meal"/>
     <UserTable />
   </>
  )
}

export default User