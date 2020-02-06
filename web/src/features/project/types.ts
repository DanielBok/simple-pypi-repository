export type Store = {
  projects: Record<string, ProjectInfo>;
  name: string;
  latestVersion: string;
  project: ProjectInfo;
  loading: {
    project: LoadingState;
  };
};

export type ProjectInfo = {
  version: string;
  summary: string;
  description: string;
  contentType: string;
  releaseDate: string;
  files: FileDetail[];
  count: {
    source: number;
    wheel: number;
  };
};

export type FileDetail = {
  filename: string;
  size: string;
  type: "Wheel" | "Source";
  pythonVersion: string;
  uploadDate: string;
};

export type FetchProjectResponse = {
  name: string;
  latestVersion: string;
  projects: ProjectInfo[];
};
