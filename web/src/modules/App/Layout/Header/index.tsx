import Logo from "@/resources/pypi.svg";
import { Layout } from "antd";
import { push } from "connected-react-router";
import React from "react";
import { useDispatch } from "react-redux";
import RightMenu from "./RightMenu";
import SearchBar from "./SearchBar";

import styles from "./styles.less";

export default () => {
  const dispatch = useDispatch();

  return (
    <Layout.Header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.title}>
          <img src={Logo} alt="PyPI Logo" className={styles.logo} onClick={() => dispatch(push("/"))} />
          <SearchBar />
        </div>
        <RightMenu />
      </div>
    </Layout.Header>
  );
};
