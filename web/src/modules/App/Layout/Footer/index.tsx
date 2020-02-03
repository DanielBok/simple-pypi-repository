import Logo from "@/resources/pypi.svg";
import { Layout, Typography } from "antd";
import React from "react";
import styles from "./styles.less";

const { Title, Paragraph } = Typography;

export default () => (
  <Layout.Footer className={styles.footer}>
    <div className={styles.imageContainer}>
      <img src={Logo} alt="" className={styles.image} />
    </div>

    <Title level={3} className={styles.subtitle}>
      © {getCopyRightYear()} Simple PyPI Repository
    </Title>
    <Paragraph className={styles.text}>
      Developed and maintained by the Python community, for the Python
      community.
    </Paragraph>
  </Layout.Footer>
);

function getCopyRightYear() {
  const currentYear = new Date().getFullYear();

  return currentYear === 2020
    ? currentYear.toString()
    : `2020 - ${currentYear}`;
}
