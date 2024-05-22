import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChatDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsBoolean()
  isGroup?: boolean

  @IsOptional()
  @IsString()
  admin?: string

  @IsArray()
  @IsNotEmpty()
  participants?: string[]

  @IsString()
  @IsOptional()
  imageUrl?: string
}