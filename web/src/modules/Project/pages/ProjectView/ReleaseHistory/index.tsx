import { RootState } from "@/infrastructure/rootState";
import { List, Tag } from "antd";
import { isEqual, orderBy } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styles from "./styles.less";

export default () => {
  const { name, latestVersion, currentVersion, versions } = useStoreData();

  return (
    <div className={styles.releaseHistory}>
      <div className={styles.title}>Select any version you want to see</div>

      <List
        itemLayout="horizontal"
        dataSource={versions}
        bordered={true}
        renderItem={item => {
          let link = `/project/${name}/desc/`;
          if (item.version !== latestVersion) link += item.version;

          return (
            <List.Item>
              <List.Item.Meta
                title={
                  <>
                    <Link to={link} className={styles.link}>
                      {item.version}
                    </Link>
                    {item.version === currentVersion && <Tag color="blue">Current Selected Version</Tag>}
                  </>
                }
                description={item.releaseDate}
              />
            </List.Item>
          );
        }}
      />
    </div>
  );
};

const useStoreData = () =>
  useSelector(({ project }: RootState) => {
    const versions = orderBy(Object.values(project.projects), e => e.version, "desc");
    const {
      latestVersion,
      name,
      project: { version: currentVersion }
    } = project;

    return { currentVersion, latestVersion, name, versions };
  }, isEqual);
