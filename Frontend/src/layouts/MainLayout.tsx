import { Footer } from "../components/footer/Footer";
import { NavBar } from "../components/nav/NavBar";
import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="font-roboto flex flex-col min-h-screen">
      <NavBar />
      <div>{children}</div>
      <Footer />
    </div>
  );
};

export default MainLayout;
