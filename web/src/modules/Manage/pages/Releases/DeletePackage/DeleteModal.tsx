import { PackageApi, PackageSelector } from "@/features/package";
import { Button, Form, Icon, Input, Modal, Typography } from "antd";
import { push } from "connected-react-router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouteContext } from "../hooks";
import styles from "./styles.less";

type Props = {
  visible: boolean;
  closeModal: () => void;
};

export default ({ visible, closeModal }: Props) => {
  const [confirm, setConfirm] = useState("");
  const { name } = useRouteContext();
  const loading = useSelector(PackageSelector.projectLoading);
  const dispatch = useDispatch();

  return (
    <Modal
      className={styles.deleteModal}
      title={<div className={styles.title}>Delete Package {name}?</div>}
      visible={visible}
      onCancel={closeModal}
      footer={[
        <Button key="back" onClick={closeModal} disabled={loading}>
          Cancel
        </Button>,
        <Button key="delete" type="danger" disabled={confirm !== name} onClick={removePackage} loading={loading}>
          Delete Package
        </Button>
      ]}
    >
      <Typography.Paragraph type="danger" className={styles.warning}>
        <Icon type="warning" theme="filled" className={styles.text} /> This action cannot be undone!
      </Typography.Paragraph>
      <Typography.Paragraph>Confirm the package name to continue</Typography.Paragraph>
      <Form.Item label={<span className={styles.formItemLabel}>Package Name</span>} colon={false}>
        <Input value={confirm} onChange={e => setConfirm(e.target.value)} placeholder={name} />
      </Form.Item>
    </Modal>
  );

  async function removePackage() {
    await dispatch(PackageApi.removePackage(name));
    closeModal();
    dispatch(push("/manage"));
  }
};
