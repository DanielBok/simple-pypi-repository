import PythonIndex from "@/resources/python-index.svg";
import React from "react";
import styles from "./styles.less";

export default () => (
  <div className={styles.intro}>
    <div className={styles.image}>
      <img src={PythonIndex} alt="python-index.svg" />
    </div>
    <div className={styles.content}>
      <p className={styles.title}>
        The Simple Python Package Index (SPI) is a repository of software for the Python programming language.
      </p>
      <p>
        SPI is a customized internal Python repository which enables you to store and share your own private packages.
        It enables both public and private download.
        <a href="https://packaging.python.org/installing/" title="External link" target="_blank" rel="noopener">
          Learn about installing packages
        </a>
      </p>
      <p>
        Package authors use SPI to distribute their software with an internal crowd (usually the same people in the
        company).{" "}
        <a
          href="https://packaging.python.org/tutorials/packaging-projects/"
          title="External link"
          target="_blank"
          rel="noopener"
        >
          Learn how to package your Python code for PyPI
        </a>
      </p>
    </div>
  </div>
);
