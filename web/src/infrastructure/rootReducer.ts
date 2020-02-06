import AccountReducer from "@/features/account/reducer";
import PackageReducer from "@/features/package/reducer";
import ProjectReducer from "@/features/project/reducer";
import { connectRouter } from "connected-react-router";
import { History } from "history";
import { combineReducers } from "redux";
import { RootState } from "./rootState";

export default (history: History) =>
  combineReducers<RootState>({
    account: AccountReducer,
    package: PackageReducer,
    project: ProjectReducer,
    router: connectRouter(history)
  });
