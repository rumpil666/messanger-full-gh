import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserDto } from 'src/user/user.dto';


export class PromiseChatDto {
  @IsNotEmpty()
  @IsString()
  id: string

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
  @IsOptional()
  participants?: UserDto[]

  @IsString()
  @IsOptional()
  imageUrl?: string
}