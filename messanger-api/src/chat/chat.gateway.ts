import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from "socket.io";
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: { origin: '*', },
  transports: ['websocket', 'polling'],
})

export class ChatGateway {
  constructor(private readonly chatService: ChatService) { }

  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log(server);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    console.log(`Connected ${client.id}`);
  }

  @SubscribeMessage("create-chat")
  async createChat(
    @MessageBody() data,
  ) {
    data.participants.forEach((nickname: string) => {
      this.server.emit(`add-chats:${nickname}`, data.chat)
    })
  }

  @SubscribeMessage("send-message")
  async sendMessage(
    @MessageBody() data,
  ) {
    data.participants.forEach((nickname: string) => {
      this.server.emit(`update-messages:${nickname}`, data.message)
    })
  }

  @SubscribeMessage("delete-chat")
  async removeChat(
    @MessageBody() data,
  ) {
    data.participants.forEach((nickname: string) => {
      this.server.emit(`delete-chat:${nickname}`, data.chatId)
    })
  }

  @SubscribeMessage("update-chat")
  async updateChat(
    @MessageBody() data,
  ) {
    data.participants.forEach((nickname: string) => {
      this.server.emit(`update-chat:${nickname}`, data.chat)
    })
  }

  @SubscribeMessage("add-user-in-chat")
  async addUserInChat(
    @MessageBody() data,
  ) {
    data.participants.forEach((nickname: string) => {
      this.server.emit(`add-user-in-chat:${nickname}`, data.chat)
    })
  }

  @SubscribeMessage("remove-user-from-chat")
  async removeUserFromChat(
    @MessageBody() data,
  ) {
    data.participants.forEach((nickname: string) => {
      this.server.emit(`remove-user-from-chat:${nickname}`, data.chat)
    })
  }
}
