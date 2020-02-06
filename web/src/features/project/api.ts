import api, { ThunkFunctionAsync } from "@/infrastructure/api";
import { notification } from "antd";
import * as Action from "./actions";
import * as Type from "./types";

/**
 * Fetches project information
 */
export const fetchProjectDetail = (project: string, version: string): ThunkFunctionAsync => async (
  dispatch,
  getState
) => {
  if (getState().package.loading.packages === "REQUEST") return;

  await api.Get<Type.FetchProjectResponse>(`project/${project}`, {
    beforeRequest: () => dispatch(Action.fetchProjectDetailAsync.request()),
    onSuccess: data => dispatch(Action.fetchProjectDetailAsync.success({ ...data, version })),
    onError: e => {
      notification.error({
        message: `Could not retrieve list of package detail. Reason: ${e.data}`,
        duration: 8
      });
      dispatch(Action.fetchProjectDetailAsync.failure());
    }
  });
};
