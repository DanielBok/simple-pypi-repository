import { AccountApi, AccountSelector } from "@/features/account";
import { Dropdown, Icon, Menu } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styles from "./styles.less";

const signedInOptions = [
  { link: "/account/login", title: "Log In" },
  { link: "/account/register", title: "Register" }
];

const MenuItem = Menu.Item;

export default () => {
  const validated = useSelector(AccountSelector.accountValidated);

  return (
    <div>
      {validated ? (
        <DropdownMenu />
      ) : (
        signedInOptions.map(({ link, title }, i) => (
          <Link to={link} key={i} className={styles.link}>
            {title}
          </Link>
        ))
      )}
    </div>
  );
};

const DropdownMenu = () => {
  const { username } = useSelector(AccountSelector.accountInfo);
  const dispatch = useDispatch();
  const items: MenuLinkProps[] = [
    { to: "/account/setting", iconType: "setting", text: "Account Settings" },
    { to: "/manage", iconType: "appstore", text: "Manage Projects" }
  ];

  return (
    <Dropdown
      overlay={
        <Menu className={styles.menu}>
          {items.map((props, i) => (
            <MenuItem className={styles.menuItem} key={i}>
              <MenuLink {...props} />
            </MenuItem>
          ))}
          <MenuItem className={styles.menuItem}>
            <Link
              to="/"
              className={styles.link}
              onClick={() => {
                dispatch(AccountApi.logout());
              }}
            >
              <Icon type="step-forward" /> Log out
            </Link>
          </MenuItem>
        </Menu>
      }
      trigger={["click"]}
    >
      <button className={styles.dropdownLink}>
        <span className={styles.text}>{username}</span>
        <Icon type="caret-down" theme="filled" />
      </button>
    </Dropdown>
  );
};

type MenuLinkProps = {
  to: string;
  iconType: string;
  text: string;
};

const MenuLink = ({ to, iconType, text }: MenuLinkProps) => (
  <Link to={to} className={styles.link}>
    <Icon type={iconType} /> {text}
  </Link>
);
