import accountRoutes from "@/modules/Account";
import homeRoutes from "@/modules/Home";
import manageRoutes from "@/modules/Manage";
import projectRoutes from "@/modules/Project";

const routeMap: Record<string, ModuleRoutes> = {
  "/": {
    clusterName: "Home",
    routes: homeRoutes
  },
  "/account": {
    clusterName: "Account",
    routes: accountRoutes
  },
  "/manage": {
    clusterName: "Manage",
    routes: manageRoutes,
    protected: true
  },
  "/project": {
    clusterName: "Project",
    routes: projectRoutes
  }
};

export const redirectPath = "/";
export default routeMap;
