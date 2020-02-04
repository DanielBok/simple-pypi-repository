import accountRoutes from "@/modules/Account";
import homeRoutes from "@/modules/Home";

const routeMap: Record<string, ModuleRoutes> = {
  "/": {
    clusterName: "Home",
    routes: homeRoutes
  },
  "/account": {
    clusterName: "Account",
    routes: accountRoutes
  }
};

export default routeMap;
