import { Button, Dropdown, Icon, Menu } from "antd";
import { push } from "connected-react-router";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import DeleteModal from "./DeleteModal";
import { DeleteModalContext } from "./hooks";

type Props = {
  name: string;
  version: string;
};

export default ({ name, version }: Props) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => dispatch(push(`/project/${name}/desc/${version}`))}>
        <Icon type="eye" theme="filled" />
        View
      </Menu.Item>
      <Menu.Item key="2" onClick={() => setVisible(true)}>
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
