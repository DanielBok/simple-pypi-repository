import { ProjectSelector } from "@/features/project";
import { serverUrl } from "@/infrastructure/api";
import { Icon, message, PageHeader } from "antd";
import cx from "classnames";
import { push } from "connected-react-router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useClipboard } from "use-clipboard-copy";
import styles from "./styles.less";

export default () => {
  const { name } = useSelector(ProjectSelector.projectMeta);
  const { version } = useSelector(ProjectSelector.project);

  return (
    <PageHeader
      className={styles.pageHeader}
      title={
        <h2 className={styles.title}>
          {name} {version}
        </h2>
      }
    >
      <div className={styles.bar}>
        <LeftPortion />
        <RightPortion />
      </div>
    </PageHeader>
  );
};

const LeftPortion = () => {
  const { name, latestVersion } = useSelector(ProjectSelector.projectMeta);
  const { version, summary } = useSelector(ProjectSelector.project);
  const clipboard = useClipboard();

  const command = `pip install --extra-index-url ${serverUrl}/simple ${name}${
    latestVersion !== version ? "==" + version : ""
  }`;

  return (
    <div className={styles.leftPortion}>
      <p>{summary}</p>
      <div className={styles.pipInstructions}>
        <div>
          {command} <input ref={clipboard.target} value={command} readOnly style={{ display: "none" }} />
        </div>
        <Icon
          type="copy"
          className={styles.copyIcon}
          onClick={() => {
            message.info("Command copied");
            clipboard.copy();
          }}
        />
      </div>
    </div>
  );
};

const RightPortion = () => {
  const dispatch = useDispatch();
  const { name, latestVersion } = useSelector(ProjectSelector.projectMeta);
  const { version, releaseDate } = useSelector(ProjectSelector.project);
  const isLatest = version === latestVersion;

  return (
    <div className={styles.rightPortion}>
      <div className={cx(styles.versionBox, isLatest ? styles.latest : styles.outdated)} onClick={goToLatest}>
        {isLatest ? "Latest version" : `Newer version available ${latestVersion}`}
      </div>
      <div className={styles.releaseDate}>Released: {releaseDate}</div>
    </div>
  );

  function goToLatest() {
    dispatch(push(`/project/${name}/desc`));
  }
};
