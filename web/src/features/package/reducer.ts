import AllActions from "@/infrastructure/rootAction";
import produce from "immer";
import { getType } from "typesafe-actions";
import * as Action from "./actions";
import * as PackageType from "./types";

const defaultState: PackageType.Store = {
  packages: [],
  packageInfo: {
    allowOverride: false,
    name: "",
    private: false,
    locks: [],
    releaseDate: "",
    summary: "",
    versionDetails: []
  },
  loading: {
    packages: "SUCCESS"
  }
};

export default (state = defaultState, action: AllActions) =>
  produce(state, draft => {
    switch (action.type) {
      case getType(Action.removePackageAsync.request):
      case getType(Action.updatePackageDetail.request):
      case getType(Action.removePackageVersionAsync.request):
      case getType(Action.fetchPackagesDetailAsync.request):
        draft.loading.packages = "REQUEST";
        break;

      case getType(Action.removePackageAsync.failure):
      case getType(Action.updatePackageDetail.failure):
      case getType(Action.removePackageVersionAsync.failure):
      case getType(Action.fetchPackagesDetailAsync.failure):
        draft.loading.packages = "FAILURE";
        break;

      case getType(Action.fetchPackagesDetailAsync.success):
        draft.loading.packages = "SUCCESS";
        draft.packages = action.payload;
        break;

      case getType(Action.removePackageVersionAsync.success): {
        draft.loading.packages = "SUCCESS";
        const { name, versionDetails } = action.payload;
        const index = draft.packages.findIndex(e => e.name === name);
        if (index >= 0) {
          draft.packages[index].versionDetails = versionDetails;
        }
        break;
      }

      case getType(Action.updatePackageDetail.success): {
        draft.loading.packages = "SUCCESS";
        const { name, ...rest } = action.payload;

        const index = draft.packages.findIndex(e => e.name === name);
        if (index >= 0) {
          draft.packages[index].private = rest.private;
          draft.packages[index].allowOverride = rest.allowOverride;
        }
        break;
      }

      case getType(Action.removePackageAsync.success):
        draft.packages = draft.packages.filter(e => e.name !== action.payload);
        break;
    }
  });
