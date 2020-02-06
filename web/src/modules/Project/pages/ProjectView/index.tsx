import { ProjectApi, ProjectSelector } from "@/features/project";
import { Tabs } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import Description from "./Description";
import DownloadFiles from "./DownloadFiles";
import ReleaseHistory from "./ReleaseHistory";
import styles from "./styles.less";
import TabTitle from "./TabTitle";
import TopBar from "./TopBar";

const { TabPane } = Tabs;

type Props = RouteComponentProps<{ project: string; version?: string }>;

const ProjectView = ({
  match: {
    params: { project, version = "" }
  }
}: Props) => {
  const dispatch = useDispatch();
  const hasVersion = useSelector(ProjectSelector.hasProjectVersion(version));

  useEffect(() => {
    dispatch(ProjectApi.fetchProjectDetail(project, version));
    // eslint-disable-next-line
  }, [project, version]);

  if (!hasVersion) {
    return null;
  }

  return (
    <div className={styles.container}>
      <TopBar />
      <Tabs defaultActiveKey="1">
        <TabPane tab={<TabTitle type="align-left" title="Project description" />} key="1">
          <Description />
        </TabPane>
        <TabPane tab={<TabTitle type="profile" title="Release history" />} key="2">
          <ReleaseHistory />
        </TabPane>
        <TabPane tab={<TabTitle type="download" title="Download files" />} key="3">
          <DownloadFiles />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default withRouter(ProjectView);
