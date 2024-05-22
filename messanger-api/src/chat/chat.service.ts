import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';
import { CreateChatDto } from './dto/create.chat.dto';
import { PromiseChatDto } from './dto/promise.chat.dto';
import { CreateMessageDto } from './dto/create.message.dto';
import { UserDto } from 'src/user/user.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService, private userService: UserService) { }

  private async processArray(participantsNickname: string[], participantsObj: UserDto[]) {
    for (const item of participantsNickname) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ...user } = await this.userService.getByNickname(item);
      participantsObj.push(user)
    }
  }

  private async getChatByNickname(myNickname: string, nickname: string) {
    const chat = await this.prisma.chat.findMany({
      where: {
        AND: [
          { isGroup: false },
          {
            AND: [
              {
                participants: {
                  some:
                    { nickname: nickname }
                }
              },
              {
                participants: {
                  some:
                    { nickname: myNickname }
                }
              },
            ]
          }
        ]
      },
      select: {
        id: true,
      },
    });
    if (!chat) throw new NotFoundException("This chat doesnt exist or you are not a participant");
    return chat;
  }

  async createChat(userId: string, chatDto: CreateChatDto): Promise<PromiseChatDto | string> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { nickname } = await this.userService.getById(userId);
    const participants = [];

    if (!chatDto.isGroup) {
      const chats = await this.getChatByNickname(nickname, chatDto.participants[0]);
      if (!chatDto.isGroup && chats[0] !== undefined) return JSON.stringify(chats[0]);
    }

    if (chatDto.participants.length < 1) throw new InternalServerErrorException("Participants are required");
    if (chatDto.participants.includes(nickname)) throw new InternalServerErrorException("You are already a participant");
    if (chatDto.isGroup && !chatDto.name) throw new InternalServerErrorException("Name is required for group chat");
    if (chatDto.isGroup && !chatDto.imageUrl) throw new InternalServerErrorException("Image is required for group chat");
    if (!chatDto.isGroup && chatDto.participants.length > 1) throw new InternalServerErrorException("this is not a group chat , you can only add one participant");

    chatDto.participants.push(nickname);

    await this.processArray(chatDto.participants, participants)

    const chat: PromiseChatDto = await this.prisma.chat.create({
      data: {
        name: chatDto.name,
        isGroup: chatDto.isGroup,
        imageUrl: chatDto.imageUrl,
        admin: userId,
        participants: {
          create: [
            ...participants?.map((user) => {
              return {
                userId: user.id,
                email: user.email,
                imageUrl: user.imageUrl,
                firstName: user.firstName,
                lastName: user.lastName,
                nickname: user.nickname,
              }
            }),
          ]
        }
      },
      select: {
        id: true,
        name: true,
        isGroup: true,
        imageUrl: true,
        admin: true,
        participants: true,
        messages: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return chat
  }

  async getChats(userId: string) {
    const chats = await this.prisma.chat.findMany({
      where: {
        participants: {
          some: {
            user: {
              id: userId
            }
          }
        }
      },
      include: {
        messages: true,
        participants: true,
      }
    });
    if (!chats) throw new NotFoundException("You dont have any chats yet");
    return chats;
  }

  async getChat(userId: string, chatId: string) {
    const chat = await this.prisma.chat.findUnique({
      where: {
        id: chatId,
        participants: {
          some: {
            user: {
              id: userId
            }
          }
        }
      },
      include: {
        messages: true,
        participants: true
      }
    });
    if (!chat) throw new NotFoundException("not chat");
    return chat;
  }

  async addUserInChat(userId: string, chatId: string, chatDto: CreateChatDto) {
    const newParticipant = chatDto.participants[0];

    const validateChat = await this.getChat(userId, chatId);
    const user = await this.userService.getByNickname(newParticipant);

    if (!validateChat) return new NotFoundException("This chat is not valodate");

    const chat = await this.prisma.chat.update({
      where: {
        id: chatId,
        participants: {
          some: {
            user: {
              id: userId
            }
          }
        }
      },
      include: {
        participants: true
      },
      data: {
        participants: {
          create: [
            {
              userId: user.id,
              email: user.email,
              imageUrl: user.imageUrl,
              firstName: user.firstName,
              lastName: user.lastName,
              nickname: user.nickname,
            }
          ]
        }
      },
    });

    if (!chat) throw new NotFoundException("Not chat");
    return chat;
  }

  async removeUserFromChat(userId: string, chatId: string, chatDto: CreateChatDto) {
    const participant = chatDto.participants[0];

    const { id: participantId } = await this.userService.getByNickname(participant);

    const chat = await this.prisma.chat.update({
      where: {
        id: chatId
      },
      data: {
        participants: {
          delete: {
            userId_chatId: { userId: participantId, chatId }
          },
        },
      },
      include: {
        participants: true
      },
    })

    return chat
  }

  async sendMessage(userId: string, chatId: string, messageDto: CreateMessageDto) {
    await this.prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        updatedAt: new Date(),
      }
    });

    const message = await this.prisma.message.create({
      data: {
        ...messageDto,
        user: {
          connect: {
            id: userId
          }
        },
        chat: {
          connect: {
            id: chatId,
          }
        }
      }
    })
    if (!message) throw new NotFoundException("Not message");
    return message;
  }

  async updateMessage(messageId: string, messageDto: CreateMessageDto) {
    const message = await this.prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        messageBody: messageDto.messageBody,
        updatedAt: new Date()
      },
    });
    if (!message) throw new NotFoundException("Not message");
    return message;
  }

  async updateChat(chatId: string, dto: CreateChatDto) {

    return await this.prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        name: dto?.name,
        imageUrl: dto?.imageUrl
      },
      include: {
        participants: true,
        messages: true
      },
    })
  }

  async removeChat(chatId: string) {
    await this.prisma.userChat.deleteMany({
      where: {
        chatId: chatId,
      },
    })

    await this.prisma.message.deleteMany({
      where: {
        chatId: chatId,
      },
    })

    const chat = await this.prisma.chat.delete({
      where: {
        id: chatId,
      },
    })

    return chat
  }

  async removeMessage(chatId: string, messageId: string) {
    const message = await this.prisma.message.delete({
      where: {
        id: messageId,
        chatId
      },
    })
    if (!message) throw new NotFoundException("Not message");
    return { chatId: chatId, id: messageId };
  }
}
