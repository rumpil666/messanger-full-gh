import { InputHTMLAttributes } from 'react'

export interface IFieldProps {
	error?: string
	title?: string
}

export type TypeInputProps = InputHTMLAttributes<HTMLInputElement> & IFieldProps
