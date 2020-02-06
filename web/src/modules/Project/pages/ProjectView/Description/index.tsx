import { ProjectSelector } from "@/features/project";
import React from "react";
import { useSelector } from "react-redux";

export default () => {
  const { description } = useSelector(ProjectSelector.project);
  return <div dangerouslySetInnerHTML={{ __html: description }} />;
};
