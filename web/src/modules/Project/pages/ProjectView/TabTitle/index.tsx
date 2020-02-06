import { Icon } from "antd";
import React from "react";
import styles from "./styles.less";


type Props = {
  type: string;
  title: string;
};

export default ({ type, title }: Props) => (
  <div className={styles.main}>
    <Icon type={type} />
    <span>{title}</span>
  </div>
);
