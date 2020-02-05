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
      case getType(Action.updatePackageDetail.request):
      case getType(Action.removePackageVersionAsync.request):
      case getType(Action.fetchProjectsDetailAsync.request):
        draft.loading.projects = "REQUEST";
        break;

      case getType(Action.updatePackageDetail.failure):
      case getType(Action.removePackageVersionAsync.failure):
      case getType(Action.fetchProjectsDetailAsync.failure):
        draft.loading.projects = "FAILURE";
        break;

      case getType(Action.fetchProjectsDetailAsync.success):
        draft.loading.projects = "SUCCESS";
        draft.projects = action.payload;
        break;

      case getType(Action.removePackageVersionAsync.success): {
        draft.loading.projects = "SUCCESS";
        const { name, versionDetails } = action.payload;
        const index = draft.projects.findIndex(e => e.name === name);
        if (index >= 0) {
          draft.projects[index].versionDetails = versionDetails;
        }
        break;
      }

      case getType(Action.updatePackageDetail.success): {
        draft.loading.projects = "SUCCESS";
        const { name, ...rest } = action.payload;

        const index = draft.projects.findIndex(e => e.name === name);
        if (index >= 0) {
          draft.projects[index].private = rest.private;
          draft.projects[index].allowOverride = rest.allowOverride;
        }
      }
    }
  });
