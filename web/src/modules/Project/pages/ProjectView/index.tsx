import { ProjectApi, ProjectSelector } from "@/features/project";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import styles from "./styles.less";
import TopBar from "./TopBar";

type Props = RouteComponentProps<{ project: string; version?: string }>;

const ProjectView = ({
  match: {
    params: { project, version = "" }
  }
}: Props) => {
  const dispatch = useDispatch();
  const noVersion = useSelector(ProjectSelector.hasProjectVersion(version));

  useEffect(() => {
    dispatch(ProjectApi.fetchProjectDetail(project, version));
    // eslint-disable-next-line
  }, [project, version]);

  if (noVersion) {
    return null;
  }

  return (
    <div className={styles.container}>
      <TopBar />
    </div>
  );
};

export default withRouter(ProjectView);
