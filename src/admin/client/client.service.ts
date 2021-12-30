import { Injectable } from '@nestjs/common';
import { Client } from 'src/generated/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientDto, ClientUdto as ClientUdto } from './dto/client.dto';
import { v4 as uuidv4 } from 'uuid';

export interface ClientServiceInterface {
  getAllAsync: () => Promise<Client[]>;
  createAsync: (dto: ClientDto) => Promise<number>;
  updateAsync: (dto: ClientDto) => Promise<Client>;
  deleteAsync: (id: number) => Promise<void>;
}
@Injectable()
export class ClientService implements ClientServiceInterface {
  constructor(private prismaService: PrismaService) {}

  async getAllAsync() {
    return await this.prismaService.client.findMany();
  }

  async createAsync(dto: ClientDto) {
    const client = await this.prismaService.client.create({
      data: { name: dto.name, apiKey: uuidv4() },
    });

    return client.id;
  }

  async updateAsync(dto: ClientUdto) {
    const client = await this.prismaService.client.update({
      where: {
        id: dto.id,
      },
      data: { name: dto.name },
    });

    return client;
  }

  async deleteAsync(id: number) {
    await this.prismaService.client.delete({
      where: {
        id: id,
      },
    });
  }
}
