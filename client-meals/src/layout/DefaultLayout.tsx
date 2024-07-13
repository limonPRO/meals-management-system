import React, { useState, ReactNode } from 'react';
import Header from '../component/Header';
import Sidebar from '../component/Sidebar';


const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen ">
   <Header/>
    <div className="flex flex-row h-full">
      <Sidebar/>
      <main className="bg-[#e9e5e5] w-[85%] overflow-y-auto p-10">
       {children}
      </main>
    </div>
  </div>
  );
};

export default DefaultLayout;
