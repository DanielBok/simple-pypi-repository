import { createAsyncAction } from "typesafe-actions";

export const fetchProjectNamesListAsync = createAsyncAction(
  "FETCH_PROJECT_NAMES_LIST_REQUEST",
  "FETCH_PROJECT_NAMES_LIST_SUCCESS",
  "FETCH_PROJECT_NAMES_LIST_FAILURE"
)<void, string[], void>();
