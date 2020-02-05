import { PackageSelector } from "@/features/package";
import { useUserPackageEffect } from "@/modules/Projects/hooks";
import BoxImg from "@/resources/whitebox.svg";
import { Button, Card, Typography } from "antd";
import { push } from "connected-react-router";
import { isEqual } from "lodash";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.less";

export default () => {
  const dispatch = useDispatch();
  const projects = useSelector(PackageSelector.projectDetails, isEqual);
  useUserPackageEffect();

  return (
    <div className={styles.container}>
      <h1>Your Projects ({projects.length})</h1>
      {projects.map(({ name, releaseDate, summary }, i) => (
        <Card bordered={true} className={styles.card} key={i}>
          <div className={styles.content}>
            <img src={BoxImg} alt="" className={styles.image} />
            <div>
              <Typography.Title level={4}>{name}</Typography.Title>
              <Typography.Paragraph>Last release on {releaseDate}</Typography.Paragraph>
              <Typography.Paragraph>{summary}</Typography.Paragraph>
            </div>

            <div className={styles.actions}>
              <Button type="primary" size="large" onClick={() => dispatch(push(`/projects/release/${name}`))}>
                Manage
              </Button>
              <Button size="large">View</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
