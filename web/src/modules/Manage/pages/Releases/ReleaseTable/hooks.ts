import React, { useContext } from "react";
import { useRouteContext } from "../hooks";

export const DeleteModalContext = React.createContext({
  version: "",
  visible: false,
  setVisible: (_: boolean) => {}
});

export const useDeleteModalContext = () => useContext(DeleteModalContext);
export { useRouteContext };
