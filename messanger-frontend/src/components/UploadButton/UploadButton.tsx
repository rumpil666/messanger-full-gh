import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

interface IUploadButtonProps {
  loading: boolean
}

export const UploadButton: React.FC<IUploadButtonProps> = ({ loading }) => {
  return (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Аватар</div>
    </button>
  );
}