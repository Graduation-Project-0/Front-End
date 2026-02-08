import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <>
      <Navbar /> 
      <main>
        {/* الـ Outlet هو اللي بيعرض الصفحات اللي جوه الـ Layout في App.jsx */}
        <Outlet /> 
      </main>
    </>
  );
};

// السطر ده هو اللي ناقص ومسبب الـ SyntaxError
export default Layout;