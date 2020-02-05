import { AccountSelector } from "@/features/account";
import { PackageApi } from "@/features/package";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useUserPackageEffect = () => {
  const dispatch = useDispatch();
  const { username } = useSelector(AccountSelector.accountInfo);

  useEffect(() => {
    if (username) dispatch(PackageApi.fetchProjectsDetail(username));
    // eslint-disable-next-line
  }, [username]);
};
