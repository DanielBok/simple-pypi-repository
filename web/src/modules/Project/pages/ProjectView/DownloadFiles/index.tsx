import { ProjectSelector, ProjectType } from "@/features/project";
import { serverUrl } from "@/infrastructure/api";
import { RootState } from "@/infrastructure/rootState";
import { Button, Input, Popconfirm, Table } from "antd";
import { ColumnProps } from "antd/lib/table";
import axios from "axios";
import { isEqual } from "lodash";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./styles.less";

export default () => {
  const { files, isPrivate, name } = useStoreData();
  const [token, setToken] = useState("");

  const columns: ColumnProps<ProjectType.FileDetail>[] = [
    {
      title: "Filename, size",
      render: (_, { filename, size }) => (
        <span>
          {isPrivate ? (
            <Popconfirm
              title={
                <>
                  <div>Enter your download token</div>
                  <Input value={token} onChange={e => setToken(e.target.value)} />
                </>
              }
              onConfirm={() => downloadFile(filename, token)}
            >
              <Button type="link">{filename}</Button>
            </Popconfirm>
          ) : (
            <a href={url(filename)}>{filename}</a>
          )}{" "}
          ({formatBytes(size)})
        </span>
      ),
      key: "filename"
    },
    { title: "File Type", dataIndex: "type" },
    { title: "Python Version", dataIndex: "pythonVersion" },
    { title: "Upload Date", dataIndex: "uploadDate" }
  ];

  return (
    <div className={styles.downloadFiles}>
      <div className={styles.title}>Select any version you want to see</div>
      <Table dataSource={files} columns={columns} rowKey="filename" />
    </div>
  );

  function downloadFile(filename: string, token: string) {
    axios
      .get(url(filename), {
        auth: { username: token, password: "" },
        responseType: "blob"
      })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement("a");
        a.href = url;
        a.setAttribute("download", filename);
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  }

  function url(filename: string) {
    return `${serverUrl}/simple/${name}/${filename}`;
  }
};

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

const useStoreData = () =>
  useSelector((state: RootState) => {
    const { files } = ProjectSelector.project(state);
    const { name, isPrivate } = state.project;

    return { files, isPrivate, name };
  }, isEqual);
