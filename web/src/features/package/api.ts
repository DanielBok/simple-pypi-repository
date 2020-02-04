import api, { ThunkFunctionAsync } from "@/infrastructure/api";
import { notification } from "antd";
import * as PackageAction from "./actions";
import * as PackageType from "./types";

/**
 * Fetches all package meta information
 */
export const fetchProjectsDetail = (username: string): ThunkFunctionAsync => async (dispatch, getState) => {
  if (getState().package.loading.projects === "REQUEST") return;

  const { data, status } = await api.Get<PackageType.ProjectInfo[]>(`package/${username}/project-details`, {
    beforeRequest: () => dispatch(PackageAction.fetchProjectsDetailAsync.request()),
    onError: e => {
      notification.error({
        message: `Could not retrieve projects detail. Reason: ${e.data}`,
        duration: 8
      });
    }
  });

  if (status === 200) {
    dispatch(PackageAction.fetchProjectsDetailAsync.success(data));
  }
};
