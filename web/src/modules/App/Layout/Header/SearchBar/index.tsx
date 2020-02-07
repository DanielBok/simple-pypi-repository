import { MetaApi, MetaSelector } from "@/features/meta";
import { AutoComplete } from "antd";
import { push } from "connected-react-router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.less";

export default () => {
  const dispatch = useDispatch();
  useProjectLoadEffect();
  const projects = useSelector(MetaSelector.projects);

  return (
    <div className={styles.searchBar}>
      <AutoComplete
        className={styles.searchBox}
        dataSource={projects}
        placeholder="Search for packages"
        onSelect={p => dispatch(push(`/project/${p}`))}
        filterOption={(inputValue, { props: { children } }) =>
          (children as string).toUpperCase().indexOf(inputValue.toUpperCase()) >= 0
        }
      />
    </div>
  );
};

const useProjectLoadEffect = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(MetaApi.fetchProjectNamesList());
    // eslint-disable-next-line
  }, []);
};
