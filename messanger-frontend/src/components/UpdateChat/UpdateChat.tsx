'use client'

import styles from "./UpdateChat.module.scss";
import { useEffect, useState } from "react";
import { Avatar, Button, Form, GetProp, Input, Select, Upload, UploadProps } from "antd";
import { SolutionOutlined } from "@ant-design/icons";
import Link from "next/link";
import { getBase64 } from "@/utils/helpers";
import ImgCrop from "antd-img-crop";
import useDebounce from "@/hooks/UseDebounce";
import { IChat, ICreateChat } from "@/types/chat.types";
import { useModalStore, resetModalСonfirmation } from "@/stores/useModalStore";
import { useUserStore } from "@/stores/useUserStore";
import { useChatStore } from "@/stores/useChatStore";
import { useUtilsStore } from "@/stores/useUtilsStore";
import { UploadButton } from "../UploadButton/UploadButton";
import { addUserInChatEvent, updateChatEvent } from "@/utils/socket";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface IUpdateChatProps {
  id: string
}

interface UpdateChat {
  imageUrl?: string
  name?: string
}

export const UpdateChat: React.FC<IUpdateChatProps> = ({ id }) => {
  const [
    currentUser,
    foundUsers,
    searchUser,
  ] = useUserStore(state => [
    state.user,
    state.foundUsers,
    state.searchUser,
  ]);
  const [
    chats,
    addNewUserInChat,
    removeUserFromChat,
    updateChat,
  ] = useChatStore(state => [
    state.chats,
    state.addNewUserInChat,
    state.removeUserFromChat,
    state.updateChat
  ]);

  const [isLoading] = useUtilsStore(state => [state.isLoading]);

  const [setIsModalСonfirmation] = useModalStore(state => [state.setIsModalСonfirmation]);

  const chat = chats.find((i) => i.id === id);
  const participants = chat?.participants
    .map((papticipant) => papticipant.nickname)
    .filter((nickname) => nickname !== currentUser.nickname)

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
    const ch: UpdateChat = {};
    for (let key in values) {
      if (!values[key] || key === 'participants') continue
      if (key === 'imageUrl') {
        ch[key] = imageUrl
        continue
      }
      ch[key as keyof UpdateChat] = values[key]
    }
    updateChat(chat!.id, ch as ICreateChat, (res) => {
      updateChatEvent(res)
    })
  }

  const isValidationField =
    !isValidate
    || ([chat?.name, undefined, ''].includes(values?.name) &&
      values?.imageUrl === undefined);

  const handleSearch = (newValue: string) => {
    setIsSearchTerm(newValue)
  };

  const handleSelect = (value: string) => {
    setIsModalСonfirmation(
      true,
      () => {
        addNewUserInChat(id, { participants: [value] }, (res) => {
          addUserInChatEvent(res)
        })
        setIsModalСonfirmation(...resetModalСonfirmation)
      },
      () => {
        form.setFieldsValue({ participants: [...participants!] })
        setIsModalСonfirmation(...resetModalСonfirmation)
      },
      "Пoдтверждение добавления участника",
      `Вы точно хотите добавить участника с ником ${value} в чат?`,
    )
  };

  const handleDeselect = (value: string) => {
    if (participants!.length < 3) {
      form.setFieldsValue({ participants: [...participants!] })
      return
    }

    setIsModalСonfirmation(
      true,
      () => {
        removeUserFromChat(id, { participants: [value] }, (res) => {
          addUserInChatEvent(res)
        })
        setIsModalСonfirmation(...resetModalСonfirmation)
      },
      () => {
        form.setFieldsValue({ participants: [...participants!] })
        setIsModalСonfirmation(...resetModalСonfirmation)
      },
      "ПОдтверждение добавления участника",
      `Вы точно хотите добавить участника с ником ${value} в чат?`,
    )
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <>
      <main className={styles.updateChat}>
        <h1 className={styles.updateChat__title}>
          Редактировать чат
        </h1>
        <Form
          name="updateChat"
          form={form}
          className={styles.updateChat__form}
          initialValues={{
            ["participants"]: participants
          }}
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
              onSelect={handleSelect}
              onDeselect={handleDeselect}
              notFoundContent={null}
              options={(foundUsers || []).map((user) => ({
                value: user.nickname,
                label: `${user.lastName} ${user.firstName}`,
              }))}
            />
          </Form.Item>
          <Form.Item shouldUpdate className={styles.updateChat__footer}>
            <Button
              className={styles.updateChat__button}
              size="large"
              htmlType="submit"
              loading={isLoading}
              form="updateChat"
              disabled={isValidationField || isLoading}
            >
              Редактировать чат
            </Button>
            <span className={styles.updateChat__assist}>
              Не хотите создавать?
              <Link href="/" className={styles.updateChat__link}>
                Вернуться
              </Link>
            </span>
          </Form.Item>
        </Form>
      </main >
    </>
  );
};