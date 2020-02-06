import { createAsyncAction } from "typesafe-actions";
import * as Type from "./types";

export const fetchProjectDetailAsync = createAsyncAction(
  "FETCH_PROJECT_DETAIL_REQUEST",
  "FETCH_PROJECT_DETAIL_SUCCESS",
  "FETCH_PROJECT_DETAIL_FAILURE"
)<void, Type.FetchProjectResponse & { version: string }, void>();
