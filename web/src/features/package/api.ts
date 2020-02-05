import { AccountStorage } from "@/features/account/localstorage";
import api, { ThunkFunctionAsync } from "@/infrastructure/api";
import { notification } from "antd";
import * as PackageAction from "./actions";
import * as PackageType from "./types";

/**
 * Fetches all package meta information
 */
export const fetchProjectsDetail = (username: string): ThunkFunctionAsync => async (dispatch, getState) => {
  if (getState().package.loading.projects === "REQUEST") return;

  const { data, status } = await api.Get<PackageType.ProjectInfo[]>(`project/${username}`, {
    beforeRequest: () => dispatch(PackageAction.fetchProjectsDetailAsync.request()),
    onError: e => {
      notification.error({
        message: `Could not retrieve projects detail. Reason: ${e.data}`,
        duration: 8
      });
      dispatch(PackageAction.fetchProjectsDetailAsync.failure());
    }
  });

  if (status === 200) {
    dispatch(PackageAction.fetchProjectsDetailAsync.success(data));
  }
};

export const updatePackageMeta = (
  payload: Pick<PackageType.ProjectInfo, "name" | "allowOverride" | "private">
): ThunkFunctionAsync => async (dispatch, getState) => {
  const { auth } = AccountStorage;
  if (getState().package.loading.projects === "REQUEST" || auth === null) return;

  await api.Put<typeof payload>(
    "/package",
    { ...payload, package: payload.name },
    {
      beforeRequest: () => dispatch(PackageAction.updatePackageDetail.request()),
      onSuccess: data => {
        notification.success({ message: "Package details updated successfully" });
        dispatch(PackageAction.updatePackageDetail.success(data));
      },
      onError: () => {
        notification.error({ message: "Package details update failed" });
        dispatch(PackageAction.updatePackageDetail.failure());
      },
      auth
    }
  );
};

export const removePackageVersion = (packageName: string, version: string): ThunkFunctionAsync => async (
  dispatch,
  getState
) => {
  const { auth } = AccountStorage;
  if (getState().package.loading.projects === "REQUEST" || auth === null) return;

  await api.Delete<PackageType.ProjectVersionDetails[]>(`package/${packageName}/manage/${version}`, undefined, {
    beforeRequest: () => dispatch(PackageAction.removePackageVersionAsync.request()),
    onSuccess: data => {
      notification.success({ message: "Package version removed" });
      dispatch(
        PackageAction.removePackageVersionAsync.success({
          name: packageName,
          versionDetails: data
        })
      );
    },
    onError: () => {
      notification.error({ message: "could not remove package version" });
      dispatch(PackageAction.removePackageVersionAsync.failure());
    },
    auth
  });
};
