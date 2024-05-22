import Image, { StaticImageData } from 'next/image';
import styles from './ImgContainer.module.scss';

interface ImgContainerProps {
    imgs: string[] | StaticImageData[];
}



export const ImgContainer: React.FC<ImgContainerProps> = ({ imgs }) => {
    const imgSize = (n: number, i: number) => {
        if ((n === 1 || n === 4 || n === 7 || n === 10) && i === 0) return 300
        if ((n === 2 || n === 5 || n === 8) && (i === 0 || i === 1)) return 150
        return 100
    }

    return (
        <div className={styles.imgContainer}>
            {imgs
                ? imgs?.map((img, i) => (
                    <Image className={styles.imgContainer__img} src={img} alt={'Отправленная картинка'} width={imgSize(imgs.length, i)} height={imgSize(imgs.length, i)} key={i} />
                ))
                : ""
            }
        </div>
    )
}