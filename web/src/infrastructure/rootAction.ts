import { AccountAction } from "@/features/account";
import { PackageAction } from "@/features/package";
import { ProjectAction } from "@/features/project";

import { ActionType } from "typesafe-actions";

type AllActions =
  | ActionType<typeof AccountAction>
  | ActionType<typeof PackageAction>
  | ActionType<typeof ProjectAction>;

export default AllActions;
