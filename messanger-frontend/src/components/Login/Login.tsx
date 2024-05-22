'use client'

import styles from "./Login.module.scss";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Button, Form, Input } from "antd";
import { useEffect, useState } from "react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import type { TLogin } from "@/types/auth.types";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUtilsStore } from "@/stores/useUtilsStore";
import { useChatStore } from "@/stores/useChatStore";

export const Login: React.FC = () => {
  const [isLoading] = useUtilsStore(state => [state.isLoading]);
  const [login] = useAuthStore(state => [state.login]);
  const [getChats] = useChatStore(state => [state.getChats]);
  const [isValidate, setIsValidate] = useState<boolean>(false);

  const { replace } = useRouter()
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setIsValidate(true))
      .catch(() => setIsValidate(false));
  }, [form, values]);

  async function handleSubmit(values: TLogin) {
    await login(values, replace)
    getChats()
  }

  return (
    <>
      <main className={styles.login}>
        <h1 className={styles.login__title}>Рады вас видеть!</h1>
        <Form
          name="login"
          form={form}
          className={styles.login__form}
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="email"
            rules={[
              {
                type: 'email',
                message: 'Неправильный формат E-mail!',
              },
              {
                required: true,
                message: 'Вы пропустили это поле',
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Вы пропустили это поле' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item shouldUpdate className={styles.login__footer}>
            <Button
              className={styles.login__button}
              size="large"
              htmlType="submit"
              loading={isLoading}
              form="login"
              disabled={!isValidate || isLoading}
            >
              Войти
            </Button>
            <span className={styles.login__assist}>
              Ещё не зарегистрированны?
              <Link href="/signup" className={styles.login__link}>
                Зарегистрироваться
              </Link>
            </span>
          </Form.Item>
        </Form>
      </main>
    </>
  );
}