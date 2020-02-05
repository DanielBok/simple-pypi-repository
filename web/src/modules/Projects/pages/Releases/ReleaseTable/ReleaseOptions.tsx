import { Button, Dropdown, Icon, Menu } from "antd";
import React, { useState } from "react";
import DeleteModal from "./DeleteModal";
import { DeleteModalContext } from "./hooks";

type Props = {
  version: string;
};

export default ({ version }: Props) => {
  const [visible, setVisible] = useState(false);

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Icon type="edit" theme="filled" />
        Manage
      </Menu.Item>
      <Menu.Item key="2">
        <Icon type="eye" theme="filled" />
        View
      </Menu.Item>
      <Menu.Item key="3" onClick={() => setVisible(true)}>
        <Icon type="delete" theme="filled" /> Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <DeleteModalContext.Provider value={{ version, visible, setVisible }}>
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button type="primary">
          Options <Icon type="caret-down" />
        </Button>
      </Dropdown>
      <DeleteModal />
    </DeleteModalContext.Provider>
  );
};
