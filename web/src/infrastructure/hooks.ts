import { ThunkDispatchAsync } from "@/infrastructure/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./rootState";

export const useRouter = () => useSelector((state: RootState) => state.router);
export const useThunkDispatch = (): ThunkDispatchAsync => useDispatch();
