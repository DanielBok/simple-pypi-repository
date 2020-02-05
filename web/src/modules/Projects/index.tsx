import Projects from "./pages/Projects";
import Releases from "./pages/Releases";

export default [
  {
    component: Projects,
    path: "/",
    title: "Projects"
  },
  {
    component: Releases,
    path: "/release/:packageName",
    title: "Release Information"
  }
] as ModuleRoute[];
