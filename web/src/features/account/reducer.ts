import AllActions from "@/infrastructure/rootAction";
import produce from "immer";
import { getType } from "typesafe-actions";

import * as AccountType from "./types";
import * as AccountAction from "./actions";

const defaultState: AccountType.Store = {
  username: "",
  email: "",
  validated: false,
  loading: "SUCCESS"
};

export default (state = defaultState, action: AllActions) =>
  produce(state, draft => {
    switch (action.type) {
      case getType(AccountAction.createUpdateAccountAsync.request):
      case getType(AccountAction.fetchAccountCredentialsAsync.request):
        draft.loading = "REQUEST";
        break;

      case getType(AccountAction.createUpdateAccountAsync.failure):
      case getType(AccountAction.fetchAccountCredentialsAsync.failure):
        draft.validated = false;
        draft.loading = "FAILURE";
        break;

      case getType(AccountAction.createUpdateAccountAsync.success):
      case getType(AccountAction.fetchAccountCredentialsAsync.success):
        draft.validated = true;
        draft.loading = "SUCCESS";
        draft.username = action.payload.username;
        draft.email = action.payload.email;
        break;

      case getType(AccountAction.logoutAccount):
        draft.validated = false;
        draft.loading = "SUCCESS";
        draft.username = "";
        draft.email = "";
        break;
    }
  });
