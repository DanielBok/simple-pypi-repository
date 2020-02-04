import { PackageType } from "@/features/package";
import { AccountType } from "@/features/account";
import { RouterState } from "connected-react-router";

export type RootState = {
  account: AccountType.Store;
  package: PackageType.Store;
  router: RouterState;
};
