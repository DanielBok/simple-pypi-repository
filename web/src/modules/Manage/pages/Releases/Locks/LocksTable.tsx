import { PackageApi, PackageType } from "@/features/package";
import { Button, Popconfirm, Table, Typography } from "antd";
import { ColumnProps } from "antd/lib/table";
import React from "react";
import { useDispatch } from "react-redux";
import { useRouteContext } from "../hooks";

export default () => {
  const dispatch = useDispatch();
  const { name, locks } = useRouteContext();

  const columns: ColumnProps<PackageType.PackageLock>[] = [
    { dataIndex: "id", title: "ID" },
    { dataIndex: "description", title: "Description" },
    { dataIndex: "token", title: "Token" },
    {
      title: "",
      render: (_, { id }) => [
        <Popconfirm
          title="Are you sure delete this task?"
          onConfirm={() => removeLock(id)}
          okText="Yes"
          cancelText="No"
          key={2}
        >
          <Button type="link">Delete</Button>
        </Popconfirm>
      ]
    }
  ];

  if (locks.length === 0)
    return (
      <Typography.Paragraph>
        Package is provide and there are no tokens given. This means that no one can download your package
      </Typography.Paragraph>
    );

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={locks}
      pagination={{
        pageSize: 5
      }}
    />
  );

  function removeLock(id: number) {
    dispatch(PackageApi.removePackageLock(name, id));
  }
};
