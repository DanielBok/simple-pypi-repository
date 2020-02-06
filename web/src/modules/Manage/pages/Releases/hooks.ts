import { PackageType } from "@/features/package";
import React from "react";

export const RouteContext = React.createContext<PackageType.PackageInfo>({
  name: "",
  summary: "",
  releaseDate: "",
  private: false,
  allowOverride: false,
  versionDetails: [],
  locks: []
});

export const useRouteContext = () => React.useContext(RouteContext);
