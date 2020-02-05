import { PackageSelector } from "@/features/package";
import { RootState } from "@/infrastructure/rootState";
import { useUserPackageEffect } from "@/modules/Projects/hooks";
import { Divider } from "antd";
import { isEqual } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";
import CardTitle from "./CardTitle";
import ControlPanel from "./ControlPanel";
import DeletePackage from "./DeletePackage";
import { RouteContext } from "./hooks";
import ReleaseTable from "./ReleaseTable";
import styles from "./styles.less";

type Props = RouteComponentProps<{
  packageName: string;
}>;

const ReleaseInformation = (props: Props) => {
  useUserPackageEffect();

  const { packageName } = props.match.params;
  const { redirect, project } = useSelector((state: RootState) => {
    const loading = state.package.loading.projects === "REQUEST";
    const project = PackageSelector.projectDetail(packageName)(state);

    return { project, redirect: project.name === "" && !loading };
  }, isEqual);

  if (redirect) {
    return <Redirect to="/projects" />;
  }

  const components = [<CardTitle />, <ControlPanel />, <DeletePackage />, <ReleaseTable />];
  return (
    <RouteContext.Provider value={project}>
      <div className={styles.container}>
        {components.map((comp, i) => (
          <div key={i}>
            {comp}
            {components.length - 1 === i && <Divider />}
          </div>
        ))}
      </div>
    </RouteContext.Provider>
  );
};

export default withRouter(ReleaseInformation);
