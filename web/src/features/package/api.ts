import { AccountStorage } from "@/features/account/localstorage";
import api, { ThunkFunctionAsync } from "@/infrastructure/api";
import { notification } from "antd";
import * as PackageAction from "./actions";
import * as PackageType from "./types";

/**
 * Fetches all package meta information
 */
export const fetchPackages = (): ThunkFunctionAsync => async (dispatch, getState) => {
  const { auth } = AccountStorage;
  if (getState().package.loading.packages === "REQUEST" || auth === null) return;

  const { data, status } = await api.Get<PackageType.PackageInfo[]>(`package`, {
    beforeRequest: () => dispatch(PackageAction.fetchPackagesDetailAsync.request()),
    onError: e => {
      notification.error({
        message: `Could not retrieve list of package detail. Reason: ${e.data}`,
        duration: 8
      });
      dispatch(PackageAction.fetchPackagesDetailAsync.failure());
    },
    auth
  });

  if (status === 200) {
    dispatch(PackageAction.fetchPackagesDetailAsync.success(data));
  }
};

/**
 * Updates package meta details
 */
export const updatePackageMeta = (
  payload: Pick<PackageType.PackageInfo, "name" | "allowOverride" | "private">
): ThunkFunctionAsync => async (dispatch, getState) => {
  const { auth } = AccountStorage;
  if (getState().package.loading.packages === "REQUEST" || auth === null) return;

  await api.Put<typeof payload>(
    "/package",
    { ...payload, package: payload.name },
    {
      beforeRequest: () => dispatch(PackageAction.updatePackageDetailAsync.request()),
      onSuccess: data => {
        notification.success({ message: "Package details updated successfully" });
        dispatch(PackageAction.updatePackageDetailAsync.success(data));
      },
      onError: () => {
        notification.error({ message: "Package details update failed" });
        dispatch(PackageAction.updatePackageDetailAsync.failure());
      },
      auth
    }
  );
};

/**
 * Removes all files associated with the specified version of the package
 */
export const removePackageVersion = (packageName: string, version: string): ThunkFunctionAsync => async (
  dispatch,
  getState
) => {
  const { auth } = AccountStorage;
  if (getState().package.loading.packages === "REQUEST" || auth === null) return;

  await api.Delete<PackageType.VersionDetail[]>(`package/${packageName}/manage/${version}`, undefined, {
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
      notification.error({ message: "Could not remove package version" });
      dispatch(PackageAction.removePackageVersionAsync.failure());
    },
    auth
  });
};

/**
 * Removes all files from the package and relinquishes control of the package
 */
export const removePackage = (packageName: string): ThunkFunctionAsync => async (dispatch, getState) => {
  const { auth } = AccountStorage;
  if (getState().package.loading.packages === "REQUEST" || auth === null) return;

  await api.Delete<PackageType.VersionDetail[]>(`package/${packageName}/manage`, undefined, {
    beforeRequest: () => dispatch(PackageAction.removePackageAsync.request()),
    onSuccess: () => {
      notification.success({ message: "Package removed" });
      dispatch(PackageAction.removePackageAsync.success(packageName));
    },
    onError: () => {
      notification.error({ message: "Could not remove package" });
      dispatch(PackageAction.removePackageAsync.failure());
    },
    auth
  });
};

/**
 * Adds a lock to the package specified
 */
export const addPackageLock = (
  packageName: string,
  payload: Omit<PackageType.PackageLock, "id">
): ThunkFunctionAsync => async (dispatch, getState) => {
  const { auth } = AccountStorage;
  if (getState().package.loading.lock === "REQUEST" || auth === null) return;

  await api.Post<PackageType.PackageLock>(`package/${packageName}/lock`, payload, {
    beforeRequest: () => dispatch(PackageAction.addPackageLockAsync.request()),
    onSuccess: lock => dispatch(PackageAction.addPackageLockAsync.success({ name: packageName, lock })),
    onError: () => dispatch(PackageAction.addPackageLockAsync.failure()),
    auth
  });
};

/**
 * Removes the package lock from the package specified
 */
export const removePackageLock = (packageName: string, id: number): ThunkFunctionAsync => async (
  dispatch,
  getState
) => {
  const { auth } = AccountStorage;
  if (getState().package.loading.lock === "REQUEST" || auth === null) return;

  const { status } = await api.Delete(`package/${packageName}/lock/${id}`, undefined, {
    beforeRequest: () => dispatch(PackageAction.removePackageLockAsync.request()),
    onError: () => dispatch(PackageAction.removePackageLockAsync.failure()),
    auth
  });

  if (status === 200) dispatch(PackageAction.removePackageLockAsync.success({ name: packageName, id }));
};
