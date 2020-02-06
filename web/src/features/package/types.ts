export type Store = {
  packages: PackageInfo[];
  packageInfo: PackageInfo;
  loading: {
    lock: LoadingState;
    packages: LoadingState;
  };
};

export type PackageInfo = {
  allowOverride: boolean;
  name: string;
  private: boolean;
  locks: PackageLock[];
  releaseDate: string;
  summary: string;
  versionDetails: VersionDetail[];
};

export type PackageLock = {
  id: number;
  description: string;
  token: string;
};

export type VersionDetail = {
  version: string;
  releaseDate: string;
  files: FileDetail[];
  count: {
    wheel: number;
    source: number;
  };
};

export type FileDetail = {
  filename: string;
  size: string;
  type: "Wheel" | "Source";
  pythonVersion: string;
  uploadDate: string;
};
