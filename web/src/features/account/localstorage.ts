import * as AccountType from "./types";

class AccountLocalStorage {
  private itemKey = "PyPI_ACCOUNT_INFO";

  public load() {
    const item = localStorage.getItem(this.itemKey);
    if (item !== null) {
      return JSON.parse(item) as AccountType.AccountInfo;
    }
    return null;
  }

  public save(user: AccountType.AccountInfo) {
    localStorage.setItem(this.itemKey, JSON.stringify(user));
  }

  public clear() {
    localStorage.removeItem(this.itemKey);
  }
}

export const AccountStorage = new AccountLocalStorage();
