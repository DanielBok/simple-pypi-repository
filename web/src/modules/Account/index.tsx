import Login from "./pages/Login";
import Register from "./pages/Register";
import Setting from "./pages/Setting";

export default [
  {
    component: Login,
    path: "/login",
    title: "Log in"
  },
  {
    component: Register,
    path: "/register",
    title: "Create an account"
  },
  {
    component: Setting,
    path: "/setting",
    title: "Edit account settings"
  }
] as ModuleRoute[];
