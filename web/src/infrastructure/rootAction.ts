import { PackageAction } from "@/features/package";
import { AccountAction } from "@/features/account";

import { ActionType } from "typesafe-actions";

type AllActions = ActionType<typeof AccountAction> | ActionType<typeof PackageAction>;

export default AllActions;
