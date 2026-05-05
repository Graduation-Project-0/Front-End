import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="flex w-full min-w-0 justify-center overflow-x-hidden">
        <div className="w-full min-w-0 max-w-[100vw]">
          <Outlet />
        </div>
      </main>
    </>
  );
};

// السطر ده هو اللي ناقص ومسبب الـ SyntaxError
export default Layout;