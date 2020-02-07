import api, { ThunkFunction, ThunkFunctionAsync } from "@/infrastructure/api";
import { notification } from "antd";
import * as AccountAction from "./actions";

import { AccountStorage } from "./localstorage";
import * as AccountType from "./types";

/**
 * Creates account in the backend server
 */
export const createAccount = (payload: AccountType.AccountInfo): ThunkFunctionAsync => async (dispatch, getState) => {
  if (getState().account.loading === "REQUEST") return;

  const { status } = await api.Post("/account", payload, {
    beforeRequest: () => dispatch(AccountAction.createUpdateAccountAsync.request())
  });

  if (status === 200) {
    dispatch(AccountAction.createUpdateAccountAsync.success(payload));
    AccountStorage.save(payload);
    notification.success({ message: `Account: ${payload.username} created. Looking forward to your contributions!` });
  } else {
    dispatch(AccountAction.createUpdateAccountAsync.failure());
    notification.error({ message: `Failed to create account` });
    AccountStorage.clear();
  }
};

/**
 * Updates the account details
 */
export const updateAccount = (newDetails: Partial<AccountType.AccountInfo>): ThunkFunctionAsync => async (
  dispatch,
  getState
) => {
  const { validated, loading } = getState().account;
  if (loading === "REQUEST" || !validated) return;

  const account = AccountStorage.load();
  const auth = AccountStorage.auth;
  if (account === null || auth === null) {
    notification.error({ message: "Could not fetch user credentials. Please enable local storage for your browser" });
    return;
  }

  await api.Put<AccountType.AccountInfo>("/account", newDetails, {
    beforeRequest: () => dispatch(AccountAction.createUpdateAccountAsync.request()),
    onSuccess: data => {
      AccountStorage.save({ ...account, ...newDetails });
      dispatch(AccountAction.createUpdateAccountAsync.success(data));
      notification.success({ message: `Account updated successfully` });
    },
    onError: () => {
      dispatch(AccountAction.createUpdateAccountAsync.failure());
      notification.error({ message: `Failed to update account` });
    },
    auth
  });
};

/**
 * Removes the account and logs out of it
 */
export const deleteAccount = (): ThunkFunctionAsync => async (dispatch, getState) => {
  const { validated, loading } = getState().account;
  if (loading === "REQUEST" || !validated) return;

  const account = AccountStorage.load();
  if (account === null) {
    notification.error({ message: "Could not fetch user credentials. Please enable local storage for your browser" });
    return;
  }
  const { username, password } = account;

  const { status } = await api.Delete(
    "/account",
    { username, password },
    {
      beforeRequest: () => dispatch(AccountAction.createUpdateAccountAsync.request())
    }
  );

  if (status === 200) {
    notification.success({ message: "Account deleted" });
    dispatch(logout());
  } else {
  }
};

/**
 * Loads account details from local storage
 */
export const loadAccount = (): ThunkFunctionAsync => async dispatch => {
  const account = AccountStorage.load();
  if (account) await dispatch(validateAccount(account));
};

/**
 * Checks if the account is valid. Used for logging in
 */
export const validateAccount = (payload: AccountType.AccountInfo): ThunkFunctionAsync<boolean> => async (
  dispatch,
  getState
) => {
  if (getState().account.loading === "REQUEST") return false;
  const { data, status } = await api.Post<AccountType.AccountInfoRedacted>(
    "/account/validate",
    {
      username: payload.username,
      password: payload.password
    },
    {
      beforeRequest: () => dispatch(AccountAction.fetchAccountCredentialsAsync.request())
    }
  );

  if (status === 200) {
    const result = { ...payload, ...data };
    dispatch(AccountAction.fetchAccountCredentialsAsync.success(result));
    AccountStorage.save(result);
    return true;
  } else {
    dispatch(AccountAction.fetchAccountCredentialsAsync.failure());
    return false;
  }
};

/**
 * Logs the account out
 */
export const logout = (): ThunkFunction => dispatch => {
  AccountStorage.clear();
  dispatch(AccountAction.logoutAccount());
};

/**
 * Checks if username or email is available from the backend
 * @param value username or email value to check
 */
export const checkValueExists = async (value: string) => {
  const { status } = await api.Get<string>(`/account/check-exists/${value}`);

  return status === 200;
};
