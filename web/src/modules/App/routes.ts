import accountRoutes from "@/modules/Account";
import homeRoutes from "@/modules/Home";
import projectsRoutes from "@/modules/Projects";

const routeMap: Record<string, ModuleRoutes> = {
  "/": {
    clusterName: "Home",
    routes: homeRoutes
  },
  "/account": {
    clusterName: "Account",
    routes: accountRoutes
  },
  "/projects": {
    clusterName: "Projects",
    routes: projectsRoutes,
    protected: true
  }
};

export const redirectPath = "/";
export default routeMap;
