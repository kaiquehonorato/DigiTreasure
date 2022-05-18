import { NextPage } from "next/types";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
const Layout: NextPage = (props) => {
  return (
    <div>
      <Header />
      <div className="min-h-screen px-2 pt-3 pb-5 sm:px-10 bg-background">{props.children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
