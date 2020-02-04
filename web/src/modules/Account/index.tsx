import Login from "./pages/Login";
import Register from "./pages/Register";

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
  }
] as ModuleRoute[];
