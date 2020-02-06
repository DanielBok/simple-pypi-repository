import { RootState } from "@/infrastructure/rootState";

export const projectMeta = (state: RootState) => {
  const { name, latestVersion } = state.project;
  return { name, latestVersion };
};

export const projects = (state: RootState) => state.project.projects;

export const project = (state: RootState) => state.project.project;

export const hasProjectVersion = (version = "") => (state: RootState) => {
  if (projectLoadingStatus(state) === "FAILURE") return false;
  if (version === "") return true;
  return projectLoadingStatus(state) === "SUCCESS" && state.project.projects.hasOwnProperty(version);
};

export const projectLoadingStatus = (state: RootState) => state.project.loading.project;
