'use client'

import styles from "./Register.module.scss";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Button, Form, Input } from "antd";
import { LockOutlined, MailOutlined, SolutionOutlined, UserOutlined } from "@ant-design/icons";
import { IAuthForm } from "@/types/auth.types";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUtilsStore } from "@/stores/useUtilsStore";
import { useChatStore } from "@/stores/useChatStore";

export const Register: React.FC = () => {
  const [register] = useAuthStore(state => [state.register]);
  const [getChats] = useChatStore(state => [state.getChats]);
  const isLoading = useUtilsStore.getState().isLoading;
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

  async function handleSubmit(values: IAuthForm) {
    await register(values, replace)
    getChats()
  }

  return (
    <>
      <main className={styles.register}>
        <h1 className={styles.register__title}>Добро пожаловать!</h1>
        <Form
          name="register"
          form={form}
          className={styles.register__form}
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="firstName"
            rules={[
              {
                required: true,
                message: 'Вы пропустили это поле'
              },
              {
                pattern: /^[а-яё\s]+$|^[\u0041-\u007a\s]+$/i,
                message: 'Не правильный формат'
              }
            ]}
          >
            <Input
              prefix={<SolutionOutlined />}
              placeholder="Имя"
            />
          </Form.Item>
          <Form.Item
            name="lastName"
            rules={[
              {
                required: true,
                message: 'Вы пропустили это поле'
              },
              {
                pattern: /^[а-яё\s]+$|^[\u0041-\u007a\s]+$/i,
                message: 'Не правильный формат'
              }
            ]}
          >
            <Input
              prefix={<SolutionOutlined />}
              placeholder="Фамилия"
            />
          </Form.Item>
          <Form.Item
            name="nickname"
            rules={[
              {
                required: true,
                message: 'Вы пропустили это поле'
              },
              {
                pattern: /^\w+$/,
                message: 'Поле может содержать только цифры и латинские буквы'
              }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nickname"
            />
          </Form.Item>
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
          <Form.Item
            name="confirm"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: 'Пожалуйста повторите пароль!'
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Пароли не совпадают!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Confirm password"
            />
          </Form.Item>
          <Form.Item shouldUpdate>
            <Button
              className={styles.register__button}
              size="large"
              htmlType="submit"
              loading={isLoading}
              form="register"
              disabled={!isValidate || isLoading}
            >
              Регистрация
            </Button>
            <span className={styles.register__assist}>
              Уже зарегистрированны?
              <Link href="/signin" className={styles.register__link}>
                Войти
              </Link>
            </span>
          </Form.Item>
        </Form>
      </main >
    </>
  );
}
