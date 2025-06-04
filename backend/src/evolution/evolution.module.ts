import { Module } from '@nestjs/common';
import { EvolutionService } from './evolution.service';
import { EvolutionClient } from '@solufy/evolution-sdk';

@Module({
  providers: [
    EvolutionService,
    {
      provide: "EVOLUTION_CLIENT",
      useFactory: () => {
        return new EvolutionClient({
          serverUrl: "https://bruno-pi.r4jlrq.easypanel.host/",
          instance: process.env.INSTANCE_NAME ?? "",
          token: process.env.API_KEY_EVOLUTION ?? ""
        })
      }
    }
  ],
  exports: [EvolutionService, "EVOLUTION_CLIENT"]
})
export class EvolutionModule {}
