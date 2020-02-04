import { RootState } from "@/infrastructure/rootState";

export const projectDetails = (state: RootState) => state.package.projects;
