import { Button, Icon, Typography } from "antd";
import React, { useState } from "react";
import DeleteModal from "./DeleteModal";
import styles from "./styles.less";

export default () => {
  const [visible, setVisible] = useState(false);

  return (
    <div className={styles.deletePackage}>
      <h2 className={styles.title}>Delete Package</h2>
      <Typography.Paragraph className={styles.text}>
        <Icon type="warning" theme="filled" /> Deleting will irreversibly delete all the releases in this package. You
        will also lose the package rights, so someone else can have this package namespace.
      </Typography.Paragraph>
      <Button type="danger" onClick={() => setVisible(true)}>
        Delete Package
      </Button>
      <DeleteModal visible={visible} closeModal={() => setVisible(false)} />
    </div>
  );
};
