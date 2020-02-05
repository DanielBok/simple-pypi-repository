import { PackageType } from "@/features/package";
import React from "react";

export const RouteContext = React.createContext<PackageType.ProjectInfo>({
  name: "",
  summary: "",
  releaseDate: "",
  private: false,
  allowOverride: false,
  versionDetails: []
});

export const useRouteContext = () => React.useContext(RouteContext);
