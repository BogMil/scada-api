import { PrismaClient } from '.prisma/client';
import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(config: ConfigService);
    onModuleDestroy(): Promise<void>;
    onModuleInit(): Promise<void>;
}
