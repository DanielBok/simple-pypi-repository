import { RootState } from "@/infrastructure/rootState";

export const accountInfo = (state: RootState) => state.account;
export const accountValidated = (state: RootState) => state.account.validated;
export const isLoading = (state: RootState) => state.account.loading === "REQUEST";
