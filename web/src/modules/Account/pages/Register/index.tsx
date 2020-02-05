import { AccountApi, AccountSelector } from "@/features/account";
import { Button, Form, Input } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { some } from "lodash";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import styles from "./styles.less";

type Props = {
  form: WrappedFormUtils;
};

const FormItem = Form.Item;
const { Password } = Input;
const USERNAME = "username",
  EMAIL = "email",
  PASSWORD = "password",
  CONFIRM = "confirm";

const RegistrationForm = ({
  form: { getFieldDecorator, getFieldError, getFieldValue, isFieldTouched, validateFields }
}: Props) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(AccountSelector.isLoading);
  const isValidated = useSelector(AccountSelector.accountValidated);

  const [checkValueAvailable] = useDebouncedCallback((key: string, value: string, callback: (msg?: string) => void) => {
    AccountApi.checkValueExists(value).then(exists => (exists ? callback(`${key} has been taken`) : callback()));
  }, 900);

  // set enter to submit form
  useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      if (ev.code === "Enter" || ev.code === "NumpadEnter") registerAccount();
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
    // eslint-disable-next-line
  }, []);

  if (isValidated) {
    return <Redirect to="/projects" />;
  }

  return (
    <div className={styles.formBody}>
      <h2 className={styles.formTitle}>Create an account</h2>
      <Form>
        <FormItem label={<b>Username</b>} className={styles.formItem}>
          {getFieldDecorator(USERNAME, {
            rules: [
              { required: true, message: "Please enter your username" },
              { validator: (_, value, callback) => checkValueAvailable("Username", value, callback) }
            ]
          })(<Input placeholder="Select a username" />)}
        </FormItem>

        <FormItem label={<b>Email Address</b>} className={styles.formItem}>
          {getFieldDecorator(EMAIL, {
            rules: [
              { required: true, message: "Please enter your email address" },
              { type: "email", message: "The input is not a valid email" },
              { validator: (_, value, callback) => checkValueAvailable("Email", value, callback) }
            ]
          })(<Input placeholder="Your email address" type="email" />)}
        </FormItem>

        <FormItem label={<b>Password</b>} className={styles.formItem}>
          {getFieldDecorator(PASSWORD, {
            rules: [
              { required: true, message: "Please input a password" },
              {
                validator: (_, value, callback) => {
                  if (value && isFieldTouched(CONFIRM)) {
                    validateFields([CONFIRM], { force: true });
                  }
                  callback();
                }
              }
            ]
          })(<Password />)}
        </FormItem>

        <FormItem label={<b>Confirm Password</b>} className={styles.formItem}>
          {getFieldDecorator(CONFIRM, {
            rules: [
              { required: true, message: "Please type your password again" },
              {
                validator: (_, value, callback) => {
                  if (value && value !== getFieldValue(PASSWORD)) {
                    callback("The two passwords do not match");
                  } else {
                    callback();
                  }
                }
              }
            ]
          })(<Password />)}
        </FormItem>
      </Form>

      <Button type="primary" loading={isLoading} disabled={disabled()} onClick={registerAccount} size="large">
        Create Account
      </Button>
    </div>
  );

  function disabled() {
    const columns = [USERNAME, EMAIL, PASSWORD, CONFIRM];

    const hasErrors = some(columns.map(col => getFieldError(col) !== undefined));
    const someNotTouched = some(columns.map(col => !isFieldTouched(col)));

    return isLoading || hasErrors || someNotTouched;
  }

  function registerAccount() {
    dispatch(
      AccountApi.createAccount({
        username: getFieldValue(USERNAME),
        password: getFieldValue(PASSWORD),
        email: getFieldValue(EMAIL)
      })
    );
  }
};

export default Form.create({ name: "Registration Form" })(RegistrationForm);
