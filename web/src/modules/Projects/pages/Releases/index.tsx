import { PackageSelector } from "@/features/package";
import { RootState } from "@/infrastructure/rootState";
import { useUserPackagesEffect } from "@/modules/Projects/hooks";
import { Divider } from "antd";
import { isEqual } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";
import CardTitle from "./CardTitle";
import ControlPanel from "./ControlPanel";
import DeletePackage from "./DeletePackage";
import { RouteContext } from "./hooks";
import Locks from "./Locks";
import ReleaseTable from "./ReleaseTable";

import styles from "./styles.less";

type Props = RouteComponentProps<{
  packageName: string;
}>;

const ReleaseInformation = (props: Props) => {
  useUserPackagesEffect();

  const { packageName } = props.match.params;
  const { redirect, project } = useSelector((state: RootState) => {
    const loading = state.package.loading.packages === "REQUEST";
    const project = PackageSelector.projectDetail(packageName)(state);

    return { project, redirect: project.name === "" && !loading };
  }, isEqual);

  if (redirect) {
    return <Redirect to="/projects" />;
  }

  const components = [
    { Component: CardTitle, type: "public" },
    { Component: ControlPanel, type: "public" },
    { Component: Locks, type: "private" },
    { Component: DeletePackage, type: "public" },
    { Component: ReleaseTable, type: "public" }
  ]
    .filter(({ type }) => project.private || type === "public")
    .map(e => e.Component);

  return (
    <RouteContext.Provider value={project}>
      <div className={styles.container}>
        {components.map((Component, i) => (
          <div key={i}>
            <Component />
            {components.length - 1 !== i && <Divider />}
          </div>
        ))}
      </div>
    </RouteContext.Provider>
  );
};

export default withRouter(ReleaseInformation);
