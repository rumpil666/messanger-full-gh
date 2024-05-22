import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MessageDto {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsString()
  @IsOptional()
  messageBody?: string

  @IsArray()
  @IsOptional()
  fileList?: string[]

  @IsString()
  @IsOptional()
  createdAt: string

  @IsString()
  @IsOptional()
  updatedAt?: string

  @IsString()
  @IsNotEmpty()
  sender: string

  @IsString()
  @IsNotEmpty()
  chatId: string
}