import { Injectable } from '@nestjs/common';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma.service';
import { hash } from 'argon2';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  getById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id
      }
    })
  }

  getByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email
      }
    })
  }

  getByNickname(nickname: string) {
    return this.prisma.user.findUnique({
      where: {
        nickname
      }
    })
  }

  async getUsers(id: string, nickname: string) {
    const { nickname: myNickname } = await this.getById(id)
    if (nickname.length === 0) return []
    const users = await this.prisma.user.findMany({
      where: {
        AND: [
          {
            nickname: {
              contains: nickname,
              mode: 'insensitive',
            },
          },
          {
            nickname: {
              not: myNickname
            }
          }
        ]

      },
      select: {
        id: true,
        email: true,
        nickname: true,
        imageUrl: true,
        firstName: true,
        lastName: true,
      }
    })

    return users;
  }

  async getProfile(id: string) {
    const profile = await this.getById(id)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = profile;
    return {
      user: rest
    }
  }

  async create(dto: AuthDto) {
    const user = {
      email: dto.email,
      nickname: dto.nickname,
      password: await hash(dto.password),
      imageUrl: dto.imageUrl,
      firstName: dto.firstName,
      lastName: dto.lastName,
    }

    return this.prisma.user.create({
      data: user
    })
  }

  async update(id: string, dto: UserDto) {
    let data = dto;

    if (dto.password) {
      data = { ...dto, password: await hash(dto.password) }
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data,
      select: {
        email: true,
        nickname: true,
        imageUrl: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        id: true,
      }
    })
  }
}
