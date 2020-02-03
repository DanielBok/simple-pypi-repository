import PackageReducer from "@/features/package/reducer";
import UserReducer from "@/features/account/reducer";
import { connectRouter } from "connected-react-router";
import { History } from "history";
import { combineReducers } from "redux";
import { RootState } from "./rootState";

export default (history: History) =>
  combineReducers<RootState>({
    package: PackageReducer,
    router: connectRouter(history),
    user: UserReducer
  });
