export type Store = {
  username: string;
  email: string;

  validated: boolean;
  loading: LoadingState;
};

export type AccountInfo = {
  username: string;
  password: string;
  email: string;
};

export type AccountInfoRedacted = Omit<AccountInfo, "password">;
