import { Injectable, NotFoundException } from '@nestjs/common';
import { NotFoundInDbPrismaException } from 'src/common/exceptions/notfoundindb.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleDto } from './dto/role.dto';

export interface RoleServiceInterface {
  create: (name: string) => Promise<number>;
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

  async create(name: string): Promise<number> {
    const role = await this.prisma.role.create({ data: { name: name } });
    return role.id;
  }

  async edit(dto: RoleDto): Promise<RoleDto> {
    try {
      return await this.prisma.role.update({
        where: { id: dto.id },
        data: { name: dto.name },
      });
    } catch (e) {
      if ((e.code = 'P2025'))
        throw new NotFoundInDbPrismaException(e.meta.cause);

      throw e;
    }
  }

  async delete(id: number) {
    try {
      await this.prisma.role.delete({
        where: { id },
      });
    } catch (e) {
      if ((e.code = 'P2025'))
        throw new NotFoundInDbPrismaException(e.meta.cause);
      throw e;
    }
  }
}
