import { PackageAction } from "@/features/package";
import { UserAction } from "@/features/account";

import { ActionType } from "typesafe-actions";

type AllActions =
  | ActionType<typeof UserAction>
  | ActionType<typeof PackageAction>;

export default AllActions;
