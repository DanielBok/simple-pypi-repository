import AllActions from "@/infrastructure/rootAction";
import produce from "immer";
import { oc } from "ts-optchain";
import { getType } from "typesafe-actions";
import * as Action from "./actions";
import * as Type from "./types";

const defaultState: Type.Store = {
  projects: {},
  project: {
    summary: "",
    releaseDate: "",
    contentType: "",
    description: "",
    version: "",
    files: [],
    count: {
      source: 0,
      wheel: 0
    }
  },
  isPrivate: false,
  name: "",
  latestVersion: "",
  loading: {
    project: "SUCCESS"
  }
};

export default (state = defaultState, action: AllActions) =>
  produce(state, draft => {
    switch (action.type) {
      case getType(Action.fetchProjectDetailAsync.request):
        draft.loading.project = "REQUEST";
        break;

      case getType(Action.fetchProjectDetailAsync.failure):
        draft.loading.project = "FAILURE";
        break;

      case getType(Action.fetchProjectDetailAsync.success): {
        const { name, projects, version, latestVersion, private: isPrivate } = action.payload;

        draft.loading.project = "SUCCESS";
        draft.projects = projects.reduce((d, p) => ({ ...d, [p.version]: p }), {} as Type.Store["projects"]);
        draft.name = name;
        draft.isPrivate = isPrivate;
        draft.latestVersion = latestVersion;
        draft.project =
          version === "" ? draft.projects[latestVersion] : oc(draft.projects[version])({ ...defaultState.project });
        break;
      }
    }
  });
