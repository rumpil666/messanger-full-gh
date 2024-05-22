'use client'

import styles from "./CreateGroup.module.scss";
import { useEffect, useState } from "react";
import { Avatar, Button, Form, GetProp, Input, Select, Upload, UploadProps } from "antd";
import { SolutionOutlined } from "@ant-design/icons";
import Link from "next/link";
import { getBase64 } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import ImgCrop from "antd-img-crop";
import useDebounce from "@/hooks/UseDebounce";
import { createChatEvent } from "@/utils/socket";
import { useChatStore } from "@/stores/useChatStore";
import { useUserStore } from "@/stores/useUserStore";
import { useUtilsStore } from "@/stores/useUtilsStore";
import { UploadButton } from "../UploadButton/UploadButton";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export const CreateGroup: React.FC = () => {
  const { push } = useRouter();
  const [chats, setChats, createChat] = useChatStore(state => [state.chats, state.setChats, state.createChat]);
  const [foundUsers, searchUser] = useUserStore(state => [state.foundUsers, state.searchUser]);
  const [isLoading] = useUtilsStore(state => [state.isLoading]);
  const [isSearchTerm, setIsSearchTerm] = useState('');
  const [isValidate, setIsValidate] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  const debouncedSearch = useDebounce(isSearchTerm, 500);

  useEffect(() => {
    if (debouncedSearch) {
      searchUser(isSearchTerm)
    }
  }, [debouncedSearch])

  const handleUpload: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
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
    values.imageUrl = imageUrl;
    values.isGroup = true;
    createChat(values, (res) => {
      push(`/chat/${res.id}`)
      if (Object.keys(res).length > 1) {
        createChatEvent(res, values.participants);
        setChats([...chats, res])
      }
    })
  }

  const isValidationField = !isValidate || !imageUrl;

  const handleSearch = (newValue: string) => {
    setIsSearchTerm(newValue)
  };

  const normFile = (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <>
      <main className={styles.createGroup}>
        <h1 className={styles.createGroup__title}>
          Создать чат!
        </h1>
        <Form
          name="createGroup"
          form={form}
          className={styles.createGroup__form}
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="imageUrl"
            valuePropName="file"
            getValueFromEvent={normFile}
          >
            <ImgCrop cropShape="round">
              <Upload
                name="avatar"
                listType="picture-circle"
                showUploadList={false}
                onChange={handleUpload}
                customRequest={({ onSuccess }) => setTimeout(() => { onSuccess!("ok") }, 0)}
              >
                {imageUrl ? <Avatar src={imageUrl} size={100} /> : <UploadButton loading={loading} />}
              </Upload>
            </ImgCrop>
          </Form.Item>
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: 'Укажите название группы!'
              },
              {
                pattern: /^[а-яё\s]+$|^[\u0041-\u007a\s]+$/i,
                message: 'Не правильный формат'
              }
            ]}
          >
            <Input
              prefix={<SolutionOutlined />}
              placeholder="Название чата"
            />
          </Form.Item>
          <Form.Item
            name="participants"
            hasFeedback
            rules={[
              {
                required: true, message: 'Please select your country!'
              },
              () => ({
                validator() {
                  if (values.participants?.length > 1) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Добавьте минимум двух участников чата'));
                },
              }),
            ]}
          >
            <Select
              mode="multiple"
              showSearch
              defaultActiveFirstOption={false}
              suffixIcon={null}
              filterOption={false}
              placeholder="Please select a country"
              value={isSearchTerm}
              onSearch={handleSearch}
              notFoundContent={null}
              options={(foundUsers || []).map((user) => ({
                value: user.nickname,
                label: `${user.lastName} ${user.firstName}`,
              }))}
            />
          </Form.Item>
          <Form.Item shouldUpdate className={styles.createGroup__footer}>
            <Button
              className={styles.createGroup__button}
              size="large"
              htmlType="submit"
              loading={isLoading}
              form="createGroup"
              disabled={isValidationField || isLoading}
            >
              Создать чат
            </Button>
            <span className={styles.createGroup__assist}>
              Не хотите создавать?
              <Link href="/" className={styles.createGroup__link}>
                Вернуться
              </Link>
            </span>
          </Form.Item>
        </Form>
      </main >
    </>
  );
};