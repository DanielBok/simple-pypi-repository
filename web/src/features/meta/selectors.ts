import { RootState } from "@/infrastructure/rootState";

export const loading = (state: RootState) => state.meta.loading;
export const projects = (state: RootState) => state.meta.projects;