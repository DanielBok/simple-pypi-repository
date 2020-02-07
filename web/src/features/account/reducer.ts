import AllActions from "@/infrastructure/rootAction";
import produce from "immer";
import { getType } from "typesafe-actions";
import * as Action from "./actions";

import * as Type from "./types";

const defaultState: Type.Store = {
  username: "",
  email: "",
  validated: false,
  loading: "SUCCESS"
};

export default (state = defaultState, action: AllActions) =>
  produce(state, draft => {
    switch (action.type) {
      case getType(Action.createUpdateAccountAsync.request):
      case getType(Action.fetchAccountCredentialsAsync.request):
        draft.loading = "REQUEST";
        break;

      case getType(Action.createUpdateAccountAsync.failure):
      case getType(Action.fetchAccountCredentialsAsync.failure):
        draft.validated = false;
        draft.loading = "FAILURE";
        break;

      case getType(Action.createUpdateAccountAsync.success):
      case getType(Action.fetchAccountCredentialsAsync.success):
        draft.validated = true;
        draft.loading = "SUCCESS";
        draft.username = action.payload.username;
        draft.email = action.payload.email;
        break;

      case getType(Action.logoutAccount):
        draft.validated = false;
        draft.loading = "SUCCESS";
        draft.username = "";
        draft.email = "";
        break;
    }
  });
