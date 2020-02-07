import { AccountType } from "@/features/account";
import { MetaType } from "@/features/meta";
import { PackageType } from "@/features/package";
import { ProjectType } from "@/features/project";
import { RouterState } from "connected-react-router";

export type RootState = {
  account: AccountType.Store;
  meta: MetaType.Store;
  package: PackageType.Store;
  project: ProjectType.Store;
  router: RouterState;
};
