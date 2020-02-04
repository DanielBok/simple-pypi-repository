import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles.less";


const signedInOptions = [
  { link: "/account/login", title: "Log In" },
  { link: "/account/register", title: "Register" }
];

export default () => {
  const isLoggedIn = false;

  return (
    <div>
      {isLoggedIn
        ? null
        : signedInOptions.map(({ link, title }, i) => (
            <Link to={link} key={i} className={styles.link}>{title}</Link>
          ))}
    </div>
  );
};
