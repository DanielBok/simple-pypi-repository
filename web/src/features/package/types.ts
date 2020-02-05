export type Store = {
  projects: ProjectInfo[];
  loading: {
    projects: LoadingState;
  };
};

export type ProjectInfo = {
  allowOverride: boolean;
  name: string;
  private: boolean;
  releaseDate: string;
  summary: string;
  versionDetails: ProjectVersionDetails[];
};

export type ProjectVersionDetails = {
  version: string;
  releaseDate: string;
  wheel: number;
  source: number;
};
