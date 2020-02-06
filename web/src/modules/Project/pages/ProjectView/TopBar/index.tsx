import { ProjectSelector } from "@/features/project";
import { serverUrl } from "@/infrastructure/api";
import { Icon, message, PageHeader } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { useClipboard } from "use-clipboard-copy";
import styles from "./styles.less";

export default () => {
  const { name, latestVersion } = useSelector(ProjectSelector.projectMeta);
  const { version, summary, releaseDate } = useSelector(ProjectSelector.project);
  const clipboard = useClipboard();

  const command = `pip install --extra-index-url ${serverUrl}/simple ${name}${
    latestVersion !== version ? "==" + version : ""
  }`;

  return (
    <div className={styles.bar}>
      <PageHeader
        className={styles.titlePortion}
        title={
          <h2 className={styles.title}>
            {name} {version}
          </h2>
        }
        subTitle={`Last Released on ${releaseDate}`}
      >
        <p>{summary}</p>
      </PageHeader>
      <div className={styles.pipInstructions}>
        <span>{command}</span>
        <input ref={clipboard.target} value={command} readOnly style={{ display: "none" }} />
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
