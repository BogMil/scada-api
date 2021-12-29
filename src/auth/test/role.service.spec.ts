import { MockContext, Context, createMockContext } from '../../context';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleService } from '../role.service';
import { Role } from 'src/generated/client';

const createRole = async (): Promise<Role> => {
  return {
    id: 1,
    name: 'role name',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

const editRole = async (): Promise<Role> => {
  return {
    id: 1,
    name: 'new role name',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

describe('RoleService', () => {
  let mockCtx: MockContext;
  let ctx: Context;

  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
  });

  describe('create', () => {
    var res;
    beforeEach(async () => {
      mockCtx.prisma.role.findMany.mockResolvedValue([await createRole()]);

      const roleService = new RoleService(
        mockCtx.prisma as unknown as PrismaService,
      );
      res = await roleService.all();
      jest.resetModules();
    });

    it('should call prisma.role.create', async () => {
      expect(ctx.prisma.role.findMany).toBeCalled();
    });

    // it('should call prisma.role.create with proper data', async () => {
    //   expect(ctx.prisma.role.create).toBeCalledWith({
    //     data: { name: 'new Role' },
    //   });
    // });

    // it('should return id', async () => {
    //   expect(res).toEqual(1);
    // });
  });

  describe('create', () => {
    var res;
    beforeEach(async () => {
      mockCtx.prisma.role.create.mockResolvedValue(await createRole());

      const roleService = new RoleService(
        mockCtx.prisma as unknown as PrismaService,
      );
      res = await roleService.create('new Role');
      jest.resetModules();
    });

    it('should call prisma.role.create', async () => {
      expect(ctx.prisma.role.create).toBeCalled();
    });

    it('should call prisma.role.create with proper data', async () => {
      expect(ctx.prisma.role.create).toBeCalledWith({
        data: { name: 'new Role' },
      });
    });

    it('should return id', async () => {
      expect(res).toEqual(1);
    });
  });

  describe('edit', () => {
    var res;
    var updatedRole;
    beforeEach(async () => {
      updatedRole = await editRole();
      mockCtx.prisma.role.update.mockResolvedValue(updatedRole);

      const roleService = new RoleService(
        mockCtx.prisma as unknown as PrismaService,
      );
      res = await roleService.edit({ id: 1, name: 'new role name' });
      jest.resetModules();
    });

    it('should call prisma.role.update', async () => {
      expect(ctx.prisma.role.update).toBeCalled();
    });

    it('should call prisma.role.update with proper data', async () => {
      expect(ctx.prisma.role.update).toBeCalledWith({
        where: { id: 1 },
        data: { name: 'new role name' },
      });
    });

    it('should return updated dto', async () => {
      expect(res).toEqual(updatedRole);
    });
  });

  describe('edit', () => {
    var res;
    beforeEach(async () => {
      mockCtx.prisma.role.delete.mockResolvedValue(await createRole());

      const roleService = new RoleService(
        mockCtx.prisma as unknown as PrismaService,
      );
      res = await roleService.delete(1);
      jest.resetModules();
    });

    it('should call prisma.role.delete', async () => {
      expect(ctx.prisma.role.delete).toBeCalled();
    });

    it('should call prisma.role.delete with proper data', async () => {
      expect(ctx.prisma.role.delete).toBeCalledWith({
        where: { id: 1 },
      });
    });
  });
});
