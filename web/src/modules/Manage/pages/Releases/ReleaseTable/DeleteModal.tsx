import { PackageApi, PackageSelector } from "@/features/package";
import { useThunkDispatch } from "@/infrastructure/hooks";
import { Button, Form, Icon, Input, Modal, Typography } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDeleteModalContext, useRouteContext } from "./hooks";
import styles from "./styles.less";

export default () => {
  const [confirm, setConfirm] = useState("");
  const dispatch = useThunkDispatch();
  const { version, visible, setVisible } = useDeleteModalContext();
  const { name } = useRouteContext();
  const loading = useSelector(PackageSelector.projectLoading);

  const closeModal = () => setVisible(false);

  return (
    <Modal
      visible={visible}
      onCancel={closeModal}
      title={<div className={styles.title}>Delete Release {version}?</div>}
      className={styles.deleteModal}
      footer={[
        <Button key="back" onClick={closeModal} disabled={loading}>
          Cancel
        </Button>,
        <Button
          key="delete"
          type="danger"
          disabled={confirm !== version}
          onClick={executePackageVersionRemoval}
          loading={loading}
        >
          Delete Release
        </Button>
      ]}
    >
      <Typography.Paragraph type="danger" className={styles.warning}>
        <Icon type="warning" theme="filled" className={styles.text} /> This action cannot be undone!
      </Typography.Paragraph>
      <Typography.Paragraph>Confirm the version to continue</Typography.Paragraph>
      <Form.Item label={<span className={styles.formItemLabel}>Version</span>} colon={false}>
        <Input value={confirm} onChange={e => setConfirm(e.target.value)} placeholder={version} />
      </Form.Item>
    </Modal>
  );

  async function executePackageVersionRemoval() {
    await dispatch(PackageApi.removePackageVersion(name, version));
  }
};
