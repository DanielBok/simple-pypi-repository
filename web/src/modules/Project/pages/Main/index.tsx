import React from "react";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";

type Props = RouteComponentProps<{ project: string }>;

const Main = ({
  match: {
    params: { project }
  }
}: Props) => <Redirect to={`/project/${project}/desc`} />;

export default withRouter(Main);
