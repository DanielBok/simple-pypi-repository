import { AccountApi, AccountSelector } from "@/features/account";
import { useRootSelector } from "@/infrastructure/hooks";
import { Button, Form, Input } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useDebouncedCallback } from "use-debounce";
import styles from "./styles.less";

type Props = {
  form: WrappedFormUtils;
};

const FIELD = "email";

const EmailForm = ({ form: { getFieldDecorator, getFieldValue, getFieldError } }: Props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { email } = useRootSelector(AccountSelector.accountInfo);

  const [checkValueAvailable] = useDebouncedCallback((key: string, value: string, callback: (msg?: string) => void) => {
    if (value === email) {
      callback();
      return;
    }

    setLoading(true);
    AccountApi.checkValueExists(value).then(exists => {
      setLoading(false);
      if (exists) {
        callback(`${key} has been taken`);
      } else {
        callback();
      }
    });
  }, 900);

  return (
    <div>
      <Form>
        <Form.Item label={<b>Email Address</b>} className={styles.formItem}>
          {getFieldDecorator(FIELD, {
            initialValue: email,
            rules: [
              { required: true, message: "Please enter your new email address" },
              { type: "email", message: "The input is not a valid email" },
              { validator: (stuff, value, callback) => checkValueAvailable("Email", value, callback) }
            ],
            validateFirst: true
          })(<Input placeholder="Email address" type="email" />)}
        </Form.Item>
      </Form>
      <Button type="primary" onClick={updateEmail} disabled={disabled()} loading={loading}>
        Save changes
      </Button>
    </div>
  );

  function updateEmail() {
    dispatch(AccountApi.updateAccount({ email: getFieldValue(FIELD) }));
  }

  function disabled() {
    return loading || getFieldValue(FIELD) === email || getFieldError(FIELD) !== undefined;
  }
};

export default Form.create({ name: "Account Setting - EMAIL" })(EmailForm);
