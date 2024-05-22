import { forwardRef } from 'react'

import styles from './Field.module.scss'
import { TypeInputProps } from './field.types'


const Field = forwardRef<HTMLInputElement, TypeInputProps>(({ title, error, className, ...rest }, ref) => {
  return (
    <label className={`${styles.field}, ${className ? className : ''}`}>
      {title && (
        <span className={styles.field__span}>{title}</span>
      )}
      <input className={error ? styles.field__input_error : styles.field__input} ref={ref} {...rest} />
      {error && (
        <span className={styles.field__error}>{error}</span>
      )}
    </label>
  )
}
)

Field.displayName = 'Field'

export default Field
