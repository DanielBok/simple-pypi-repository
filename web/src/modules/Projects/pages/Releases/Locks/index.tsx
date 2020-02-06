import React from "react";
import { useRouteContext } from "../hooks";
import LocksTable from "./LocksTable";
import NewLock from "./NewLock";

import styles from "./styles.less";

export default () => {
  const { private: isPrivate } = useRouteContext();
  if (!isPrivate) {
    return null;
  }

  return (
    <div className={styles.controlPanel}>
      <h2>Package Locks</h2>
      <LocksTable />
      <NewLock />
    </div>
  );
};
