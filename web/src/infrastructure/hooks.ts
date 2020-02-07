import { ThunkDispatchAsync } from "@/infrastructure/api";
import { isEqual } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./rootState";

export const useRouter = () => useSelector((state: RootState) => state.router);
export const useThunkDispatch = (): ThunkDispatchAsync => useDispatch();

export function useRootSelector<R = unknown>(
  selector: (state: RootState) => R,
  equalityFn?: (left: R, right: R) => boolean
) {
  if (equalityFn === undefined) equalityFn = isEqual;
  return useSelector(selector, isEqual);
}
