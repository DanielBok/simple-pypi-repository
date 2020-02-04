import { AccountApi } from "@/features/account";
import { routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import { applyMiddleware, createStore, Store } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import createReducer from "./rootReducer";

export const history = createBrowserHistory();

function configureStore() {
  const middleware = composeWithDevTools(applyMiddleware(thunk, routerMiddleware(history)));

  const store = createStore(createReducer(history), middleware);
  initialSetup(store);

  return store;
}

function initialSetup(store: Store) {
  const dispatch = (t: any) => store.dispatch(t);

  dispatch(AccountApi.loadAccount());
}

export default configureStore();
