import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
