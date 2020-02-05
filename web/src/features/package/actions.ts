import { createAction, createAsyncAction } from "typesafe-actions";
import * as PackageType from "./types";

export const fetchProjectsDetailAsync = createAsyncAction(
  "FETCH_PROJECTS_DETAIL_REQUEST",
  "FETCH_PROJECTS_DETAIL_SUCCESS",
  "FETCH_PROJECTS_DETAIL_FAILURE"
)<void, PackageType.ProjectInfo[], void>();

export const removePackageAsync = createAsyncAction(
  "REMOVE_PACKAGE_REQUEST",
  "REMOVE_PACKAGE_SUCCESS",
  "REMOVE_PACKAGE_FAILURE"
)<void, string, void>();

export const removePackageVersionAsync = createAsyncAction(
  "REMOVE_PACKAGE_VERSION_REQUEST",
  "REMOVE_PACKAGE_VERSION_SUCCESS",
  "REMOVE_PACKAGE_VERSION_FAILURE"
)<void, Pick<PackageType.ProjectInfo, "name" | "versionDetails">, void>();

export const updatePackageDetail = createAsyncAction(
  "UPDATE_PROJECTS_DETAIL_REQUEST",
  "UPDATE_PROJECTS_DETAIL_SUCCESS",
  "UPDATE_PROJECTS_DETAIL_FAILURE"
)<void, Pick<PackageType.ProjectInfo, "name" | "allowOverride" | "private">, void>();

export const resetLoadingStore = createAction("RESET_PACKAGE_LOADING_STORE")<void>();
