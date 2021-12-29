import { RoleModule } from './admin/role/role.module';
import { ClientModule } from './admin/client/client.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './common/guards';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    RoleModule,
    ClientModule,
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    HttpModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: AtGuard }],
})
export class AppModule {}
