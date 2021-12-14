import { PrismaClient } from '.prisma/client';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: { url: config.get<string>('DATABASE_URL') },
      },
    });
  }

  async onModuleDestroy() {
    await this.$connect();
  }
  async onModuleInit() {
    await this.$disconnect();
  }
}
