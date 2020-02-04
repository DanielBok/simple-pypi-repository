import { createAction, createAsyncAction } from "typesafe-actions";
import * as AccountType from "./types";

export const createUpdateAccountAsync = createAsyncAction(
  "CREATE_UPDATE_ACCOUNT_REQUEST",
  "CREATE_UPDATE_ACCOUNT_SUCCESS",
  "CREATE_UPDATE_ACCOUNT_FAILURE"
)<void, AccountType.AccountInfoRedacted, void>();

export const fetchAccountCredentialsAsync = createAsyncAction(
  "FETCH_ACCOUNT_CREDENTIALS_REQUEST",
  "FETCH_ACCOUNT_CREDENTIALS_SUCCESS",
  "FETCH_ACCOUNT_CREDENTIALS_FAILURE"
)<void, AccountType.AccountInfoRedacted, void>();

export const logoutAccount = createAction("LOGOUT_ACCOUNT")<void>();
