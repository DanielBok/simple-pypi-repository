import { AccountSelector } from "@/features/account";
import { Divider } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import EmailForm from "./EmailForm";

import styles from "./styles.less";

export default () => {
  const {username} = useSelector(AccountSelector.accountInfo)

  return (
    <div className={styles.settingsBody}>
      <h2 className={styles.title}>Account Settings</h2>
      <Divider />
      <div className={styles.subtitle}>Account Details</div>
      <div className={styles.userInfo}>
        <div className={styles.label}>Username</div>
        <div className={styles.value}>{username}</div>
      </div>

      <EmailForm />
    </div>
  );
};
