import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleDto } from './dto/role.dto';

export interface RoleServiceInterface {
  create: (dto: RoleDto) => Promise<number>;
  edit: (dto: RoleDto) => Promise<RoleDto>;
  delete: (id: number) => Promise<void>;
  all: () => Promise<RoleDto[]>;
}

@Injectable()
export class RoleService implements RoleServiceInterface {
  constructor(private prisma: PrismaService) {}

  async all(): Promise<RoleDto[]> {
    return await this.prisma.role.findMany();
  }

  async create(dto: RoleDto): Promise<number> {
    const role = await this.prisma.role.create({
      data: { name: dto.name, id: dto.id },
    });
    return role.id;
  }

  async edit(dto: RoleDto): Promise<RoleDto> {
    return await this.prisma.role.update({
      where: { id: dto.id },
      data: { name: dto.name },
    });
  }

  async delete(id: number) {
    await this.prisma.role.delete({
      where: { id },
    });
  }
}
