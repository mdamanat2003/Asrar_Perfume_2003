import React, { Fragment } from "react";
import Header from "./Header";
 import Footer from "./Footer";

export default function Layout({ children, onSearch }) {
  return (
    <>
      <Fragment>
      <Header onSearch={onSearch} />
      <main>{children}</main>
      <Footer />
      </Fragment>
    </>
  );
}
