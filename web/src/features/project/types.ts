export type Store = {
  projects: {
    [version: string]: ProjectInfo;
  };
  name: string;
  latestVersion: string;
  isPrivate: boolean
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
  size: number;
  type: "Wheel" | "Source";
  pythonVersion: string;
  uploadDate: string;
};

export type FetchProjectResponse = {
  name: string;
  latestVersion: string;
  private: boolean
  projects: ProjectInfo[];
};
