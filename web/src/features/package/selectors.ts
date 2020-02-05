import { RootState } from "@/infrastructure/rootState";

export const projectDetails = (state: RootState) => state.package.projects;
export const projectDetail = (packageName: string) => (state: RootState) =>
  state.package.projects.find(e => e.name === packageName) || {
    name: "",
    allowOverride: false,
    private: false,
    releaseDate: "",
    summary: "",
    versionDetails: []
  };

export const projectLoading = (state: RootState) => state.package.loading.projects === "REQUEST";
