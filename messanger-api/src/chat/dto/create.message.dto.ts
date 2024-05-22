import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {

  @IsString()
  @IsOptional()
  messageBody?: string

  @IsArray()
  @IsOptional()
  fileList?: string[]

  @IsString()
  @IsOptional()
  createdAt?: string
}