import { AccountSelector } from "@/features/account";
import { PackageApi, PackageSelector } from "@/features/package";
import BoxImg from "@/resources/whitebox.svg";
import { Button, Card, Typography } from "antd";
import { isEqual } from "lodash";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.less";

export default () => {
  const dispatch = useDispatch();
  const { username } = useSelector(AccountSelector.accountInfo);
  const projects = useSelector(PackageSelector.projectDetails, isEqual);

  useEffect(() => {
    if (username) dispatch(PackageApi.fetchProjectsDetail(username));
    // eslint-disable-next-line
  }, [username]);

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
              <Button type="primary" size="large">
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
