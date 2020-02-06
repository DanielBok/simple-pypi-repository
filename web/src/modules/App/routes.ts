import accountRoutes from "@/modules/Account";
import homeRoutes from "@/modules/Home";
import projectsRoutes from "@/modules/Manage";

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
    routes: projectsRoutes,
    protected: true
  }
};

export const redirectPath = "/";
export default routeMap;
