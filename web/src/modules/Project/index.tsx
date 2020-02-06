import Main from "./pages/Main";
import ProjectView from "./pages/ProjectView";

export default [
  {
    component: Main,
    path: "/:project",
    title: "Projects"
  },
  {
    component: ProjectView,
    path: "/:project/desc/:version?",
    title: "Projects"
  }
] as ModuleRoute[];
