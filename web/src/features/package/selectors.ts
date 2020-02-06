import { RootState } from "@/infrastructure/rootState";
import * as T from "./types";

export const projectDetails = (state: RootState) => state.package.packages;
export const projectDetail = (packageName: string) => (state: RootState): T.PackageInfo =>
  state.package.packages.find(e => e.name === packageName) || {
    name: "",
    allowOverride: false,
    private: false,
    releaseDate: "",
    summary: "",
    versionDetails: [],
    locks: []
  };

export const projectLoading = (state: RootState) => state.package.loading.packages === "REQUEST";
