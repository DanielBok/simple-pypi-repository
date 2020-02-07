import api, { ThunkFunctionAsync } from "@/infrastructure/api";
import * as Action from "./actions";
import * as Selector from "./selectors";

export const fetchProjectNamesList = (): ThunkFunctionAsync => async (dispatch, getState) => {
  if (Selector.loading(getState()).projects === "REQUEST") return;

  await api.Get<string[]>("/project", {
    beforeRequest: () => dispatch(Action.fetchProjectNamesListAsync.request()),
    onError: () => dispatch(Action.fetchProjectNamesListAsync.failure()),
    onSuccess: data => dispatch(Action.fetchProjectNamesListAsync.success(data))
  });
};
