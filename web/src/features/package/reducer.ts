import AllActions from "@/infrastructure/rootAction";
import produce from "immer";
import { getType } from "typesafe-actions";
import * as Action from "./actions";
import * as PackageType from "./types";

const defaultState: PackageType.Store = {
  projects: [],
  loading: {
    projects: "SUCCESS"
  }
};

export default (state = defaultState, action: AllActions) =>
  produce(state, draft => {
    switch (action.type) {
      case getType(Action.fetchProjectsDetailAsync.request):
        draft.loading.projects = "REQUEST";
        break;

      case getType(Action.fetchProjectsDetailAsync.failure):
        draft.loading.projects = "FAILURE";
        break;

      case getType(Action.fetchProjectsDetailAsync.success):
        draft.loading.projects = "SUCCESS";
        draft.projects = action.payload;
        break;
    }
  });
