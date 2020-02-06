import { PackageApi } from "@/features/package";
import { Button, Form, Switch } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React, { FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useRouteContext } from "../hooks";
import styles from "./styles.less";

type Props = {
  form: WrappedFormUtils;
};

const IS_PRIVATE = "isPrivate",
  ALLOW_OVERRIDE = "allowOverride";

const ControlPanel = ({ form: { getFieldDecorator, getFieldValue } }: Props) => {
  const dispatch = useDispatch();
  const { name, allowOverride, private: isPrivate } = useRouteContext();
  const disabled = getFieldValue(IS_PRIVATE) === isPrivate && getFieldValue(ALLOW_OVERRIDE) === allowOverride;

  return (
    <div className={styles.controlPanel}>
      <h2>Control Panel</h2>
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} onSubmit={handleSubmit}>
        <Form.Item label="Private" help="If set to true, users will need a token to download the package">
          {getFieldDecorator(IS_PRIVATE, {
            initialValue: isPrivate,
            valuePropName: "checked"
          })(<Switch />)}
        </Form.Item>

        <Form.Item
          label="Allow Override"
          help={
            <span>
              If set to true, uploading a new package with the same name will override the existing package. If false,
              uploading a package with the same name will result in failure.
            </span>
          }
        >
          {getFieldDecorator(ALLOW_OVERRIDE, {
            initialValue: allowOverride,
            valuePropName: "checked"
          })(<Switch />)}
        </Form.Item>

        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Button type="primary" htmlType="submit" disabled={disabled}>
            Save changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    dispatch(
      PackageApi.updatePackageMeta({
        name,
        allowOverride: getFieldValue(ALLOW_OVERRIDE),
        private: getFieldValue(IS_PRIVATE)
      })
    );
  }
};

export default Form.create({ name: "Project Control Panel" })(ControlPanel);
