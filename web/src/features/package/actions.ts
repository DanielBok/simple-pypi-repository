import { createAction, createAsyncAction } from "typesafe-actions";
import * as PackageType from "./types";

export const fetchProjectsDetailAsync = createAsyncAction(
  "FETCH_PROJECTS_DETAIL_REQUEST",
  "FETCH_PROJECTS_DETAIL_SUCCESS",
  "FETCH_PROJECTS_DETAIL_FAILURE"
)<void, PackageType.ProjectInfo[], void>();


export const resetLoadingStore = createAction("RESET_PACKAGE_LOADING_STORE")<
  void
>();
