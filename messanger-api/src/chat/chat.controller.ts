import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ChatService } from './chat.service';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { CreateChatDto } from './dto/create.chat.dto';
import { CreateMessageDto } from './dto/create.message.dto';

@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) { }

    @Post('')
    @Auth()
    @UsePipes(ValidationPipe)
    async createChat(@CurrentUser('id') id: string, @Body() ChatDto: CreateChatDto) {
        return await this.chatService.createChat(id, ChatDto);
    }

    @Get('')
    @Auth()
    async getChats(@CurrentUser('id') id: string) {
        return await this.chatService.getChats(id);
    }

    @Get('/:id')
    @Auth()
    async getChat(@CurrentUser('id') id: string, @Param('id') ChatId: string) {
        return await this.chatService.getChat(id, ChatId);
    }

    @Put('/add-user/:id')
    @Auth()
    async addUserInChat(@CurrentUser('id') id: string, @Param('id') ChatId: string, @Body() chatDto: CreateChatDto) {
        return await this.chatService.addUserInChat(id, ChatId, chatDto);
    }

    @Delete('/remove-user/:id')
    @Auth()
    async removeUserFromChat(@CurrentUser('id') id: string, @Param('id') ChatId: string, @Body() chatDto: CreateChatDto) {
        return await this.chatService.removeUserFromChat(id, ChatId, chatDto);
    }

    @Delete('/remove/:id')
    @Auth()
    async removeChat(@Param('id') ChatId: string) {
        return await this.chatService.removeChat(ChatId);
    }

    @Put('/update/:id')
    @Auth()
    async updateChat(@Param('id') ChatId: string, @Body() chatDto: CreateChatDto) {
        return await this.chatService.updateChat(ChatId, chatDto);
    }

    @Post('/message/:id')
    @UsePipes(ValidationPipe)
    @Auth()
    async sendMessage(@CurrentUser('id') id: string, @Param('id') ChatId: string, @Body() message: CreateMessageDto) {
        return await this.chatService.sendMessage(id, ChatId, message);
    }

    @Put('/message/:id')
    @UsePipes(ValidationPipe)
    @Auth()
    async updateMessage(@Param('id') MessageId: string, @Body() message: CreateMessageDto) {
        return await this.chatService.updateMessage(MessageId, message);
    }

    @Delete('/message/:id')
    @Auth()
    async removeMessage(@Param('id') messageId: string, @Body() ChatId: string[]) {
        return await this.chatService.removeMessage(ChatId[0], messageId);
    }
}
