import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string

  @IsOptional()
  @IsString()
  nickname?: string

  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  @IsString()
  password: string

  @IsOptional()
  @IsString()
  imageUrl?: string

  @IsOptional()
  @IsString()
  firstName?: string

  @IsOptional()
  @IsString()
  lastName?: string
}