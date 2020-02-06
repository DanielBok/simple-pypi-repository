import { PackageType } from "@/features/package";
import { Table } from "antd";
import { ColumnProps } from "antd/lib/table";
import React from "react";
import { useRouteContext } from "./hooks";
import ReleaseOptions from "./ReleaseOptions";

import styles from "./styles.less";

export default () => {
  const { versionDetails } = useRouteContext();
  const columns: ColumnProps<PackageType.VersionDetail>[] = [
    { title: "Version", dataIndex: "version" },
    { title: "Release Date", dataIndex: "releaseDate" },
    {
      title: "Files",
      render: (_, { count: { wheel, source } }) => {
        const pkg = [];
        if (wheel > 0) pkg.push(`${wheel} Wheel`);
        if (source > 0) pkg.push(`${source} Source`);

        return `${wheel + source} files (${pkg.join(", ")})`;
      }
    },
    {
      title: "",
      render: (_, { version }) => <ReleaseOptions version={version} />
    }
  ];

  return (
    <div className={styles.releaseTable}>
      <h2 className={styles.title}>Releases ({versionDetails.length})</h2>
      <Table rowKey="version" bordered={false} dataSource={versionDetails} columns={columns} />
    </div>
  );
};
