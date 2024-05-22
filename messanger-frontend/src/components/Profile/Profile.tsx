'use client'

import styles from "./Profile.module.scss";
import logo from "@/image/logo.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Avatar, Button, Form, GetProp, Input, Space, Upload, UploadProps } from "antd";
import { MailOutlined, SolutionOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { getBase64 } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import ImgCrop from "antd-img-crop";
import type { UpdateUser } from "@/types/user.types";
import { useUserStore } from "@/stores/useUserStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUtilsStore } from "@/stores/useUtilsStore";
import { UploadButton } from "../UploadButton/UploadButton";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export const Profile: React.FC = () => {
  const { push } = useRouter()
  const [currentUser, updateProfile] = useUserStore(state => [state.user, state.updateProfile]);
  const [logout] = useAuthStore(state => [state.logout]);

  const [isLoading] = useUtilsStore(state => [state.isLoading]);
  const [isValidate, setIsValidate] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
        values.imageUrl = url;
      });
    }
  };

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setIsValidate(true))
      .catch(() => setIsValidate(false));
  }, [form, values, values?.imageUrl]);

  function handleSubmit() {
    const user: UpdateUser = {};
    for (let key in values) {
      if (!values[key]) continue
      if (key === 'imageUrl') {
        user[key] = imageUrl
        continue
      }
      user[key as keyof UpdateUser] = values[key]
    }
    updateProfile(user)
  }

  const isValidationField =
    !isValidate
    || ([currentUser.lastName, undefined, ''].includes(values?.lastName) &&
      [currentUser.firstName, undefined, ''].includes(values?.firstName) &&
      [currentUser.nickname, undefined, ''].includes(values?.nickname) &&
      [currentUser.email, undefined, ''].includes(values?.email) &&
      values?.imageUrl === undefined);

  return (
    <>
      <main className={styles.profile}>
        <div className={styles.profile__header}>
          <Link className={styles.profile__logo} href="/">
            <Image
              src={logo}
              width={38}
              height={38}
              alt="Logo"
            />
          </Link>
          <h1 className={styles.profile__title}>
            {`Привет, ${`${currentUser.lastName} ${currentUser.firstName}` ?? ""}!`}
          </h1>
        </div>
        <Form
          name="profile"
          form={form}
          className={styles.profile__form}
          initialValues={{
            ["firstName"]: currentUser.firstName,
            ["lastName"]: currentUser.lastName,
            ["nickname"]: currentUser.nickname,
            ["email"]: currentUser.email,
          }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="imageUrl"
            valuePropName="file"
          >
            <ImgCrop cropShape="round">
              <Upload
                name="avatar"
                listType="picture-circle"
                showUploadList={false}
                onChange={handleChange}
                customRequest={({ onSuccess }) => setTimeout(() => { onSuccess!("ok") }, 0)}
              >
                {imageUrl ? <Avatar src={imageUrl} size={100} /> : <UploadButton loading={loading} />}
              </Upload>
            </ImgCrop>
          </Form.Item>
          <Form.Item
            name="firstName"
            rules={[
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
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item shouldUpdate>
            <Space className={styles.profile__button_container}>
              <Button
                className={styles.profile__button}
                size="large"
                htmlType="submit"
                loading={isLoading}
                form="profile"
                disabled={isValidationField || isLoading}
              >
                Редактировать
              </Button>
              <Button
                className={styles.profile__button}
                size="large"
                danger
                onClick={() => {
                  push('/signin')
                  logout()
                }}
              >
                Выйти из аккаунта
              </Button>
            </Space>
            <span className={styles.profile__assist}>
              Вернуться назад?
              <Link href="/" className={styles.profile__link}>
                Вернуться
              </Link>
            </span>
          </Form.Item>
        </Form>
      </main >
    </>
  );
};