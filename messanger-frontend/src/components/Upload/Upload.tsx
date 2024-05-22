import { MutableRefObject, useEffect, useRef } from "react";
import styles from "./Upload.module.scss";
import { FileImageOutlined } from '@ant-design/icons';

interface UploadProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>, ref: MutableRefObject<null>) => void;
}

export const Upload: React.FC<UploadProps> = ({ onChange }) => {
  const ref = useRef(null);

  return (
    <label className={styles.upload} >
      <FileImageOutlined width={'16px'} height={'16px'} style={{ color: "#2982FF" }} />
      <input
        className={styles.upload__input}
        type="file"
        multiple
        ref={ref}
        onChange={(e) => {
          onChange(e, ref)
        }}
      />
    </label>
  );
};