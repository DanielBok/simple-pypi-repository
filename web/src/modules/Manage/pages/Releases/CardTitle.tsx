import BoxImg from "@/resources/whitebox.svg";
import { Card, Typography } from "antd";
import React from "react";
import { useRouteContext } from "./hooks";
import styles from "./styles.less";

export default () => {
  const { name, summary } = useRouteContext();
  return (
    <Card bordered={true} className={styles.card}>
      <div className={styles.content}>
        <img src={BoxImg} alt="" className={styles.image} />
        <div>
          <Typography.Title level={3}>{name}</Typography.Title>
          <Typography.Paragraph>{summary}</Typography.Paragraph>
        </div>
      </div>
    </Card>
  );
};
