import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { EvolutionClient } from '@solufy/evolution-sdk';

@Injectable()
export class EvolutionService {
  constructor(
    @Inject("EVOLUTION_CLIENT") private readonly evolutionClient: EvolutionClient
  ) { }
  
  async sendMessage(number: string, message: string) {
    try {
      const numberToSendMessage = "55" + number + "@s.whatsapp.net"
      await this.evolutionClient.messages.sendText({ 
        number: numberToSendMessage,
        text: message
       })
    } catch (error) {
      console.error("An error ocurred while sending message", error)
      throw new InternalServerErrorException("An error ocurred while sending message")
    }
  }
}
