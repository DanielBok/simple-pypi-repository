import { AccountApi, AccountSelector } from "@/features/account";
import { Button, Form, Icon, Input } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { some } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.less";

type Props = {
  form: WrappedFormUtils;
};

const FormItem = Form.Item;
const { Password } = Input;
const USERNAME = "username",
  PASSWORD = "password";

const LoginForm = ({ form: { getFieldDecorator, getFieldError, getFieldValue, isFieldTouched } }: Props) => {
  const [hasError, setHasError] = useState(false);
  const dispatch = useDispatch();
  const isLoading = useSelector(AccountSelector.isLoading);

  // set enter to submit form
  useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      if (ev.code === "Enter" || ev.code === "NumpadEnter") login();
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, []);

  return (
    <div className={styles.formBody}>
      <h2 className={styles.formTitle}>Log in to Simple PyPI</h2>
      <Form>
        <FormItem label={<b>Username</b>} className={styles.formItem}>
          {getFieldDecorator(USERNAME, {
            rules: [{ required: true, message: "Please enter your username" }]
          })(<Input placeholder="Select a username" />)}
        </FormItem>

        <FormItem label={<b>Password</b>} className={styles.formItem}>
          {getFieldDecorator(PASSWORD, {
            rules: [{ required: true, message: "Please enter your password" }]
          })(<Password />)}
        </FormItem>
      </Form>

      {hasError && (
        <div className={styles.error}>
          <Icon type="exclamation-circle" className={styles.icon} />
          Could not login with the credentials provided
        </div>
      )}

      <Button type="primary" loading={isLoading} disabled={disabled()} onClick={login} size="large">
        Login
      </Button>
    </div>
  );

  function disabled() {
    const columns = [USERNAME, PASSWORD];

    const hasErrors = some(columns.map(col => getFieldError(col) !== undefined));
    const someNotTouched = some(columns.map(col => !isFieldTouched(col)));

    return isLoading || hasErrors || someNotTouched;
  }

  async function login() {
    const successful = ((await dispatch(
      AccountApi.validateAccount({
        username: getFieldValue(USERNAME),
        password: getFieldValue(PASSWORD),
        email: "" // email is not required for logging in as it will be provided in the api response
      })
    )) as unknown) as boolean;

    setHasError(!successful);
  }
};

export default Form.create({ name: "Login Form" })(LoginForm);
