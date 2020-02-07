import AllActions from "@/infrastructure/rootAction";
import produce from "immer";
import { getType } from "typesafe-actions";
import * as Action from "./actions";
import * as Type from "./types";

const defaultState: Type.Store = {
  projects: [],
  loading: {
    projects: "SUCCESS"
  }
};

export default (state = defaultState, action: AllActions) =>
  produce(state, draft => {
    switch (action.type) {
      case getType(Action.fetchProjectNamesListAsync.request):
        draft.loading.projects = "REQUEST";
        break;

      case getType(Action.fetchProjectNamesListAsync.failure):
        draft.loading.projects = "FAILURE";
        break;

      case getType(Action.fetchProjectNamesListAsync.success):
        draft.loading.projects = "SUCCESS";
        draft.projects = action.payload;
        break;
    }
  });
