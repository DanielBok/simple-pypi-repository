import { PackageType } from "@/features/package";
import { UserType } from "@/features/account";
import { RouterState } from "connected-react-router";

export type RootState = {
  package: PackageType.Store;
  user: UserType.Store;
  router: RouterState;
};
