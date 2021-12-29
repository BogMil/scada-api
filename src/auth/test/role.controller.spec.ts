import { ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AtGuard, RtGuard } from '../../common/guards';
import { jwtPayloadStub } from './stubs';
import { RoleController } from '../role.controller';
import { RoleService } from '../role.service';
import { roleDtoEditedStub, roleDtoStub } from './stubs/roleDto.stub';

jest.mock('../role.service.ts');

describe('RoleController', () => {
  let roleController: RoleController;
  let roleService: RoleService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [RoleController],
      providers: [RoleService],
    })
      .overrideGuard(RtGuard)
      .useValue({
        canActivate: (_: ExecutionContext) => {
          return true;
        },
      })
      .overrideGuard(AtGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = jwtPayloadStub();
          return true;
        },
      })
      .compile();

    roleService = moduleRef.get<RoleService>(RoleService);
    roleController = moduleRef.get<RoleController>(RoleController);
    jest.clearAllMocks();
  });

  describe('get roles', () => {
    describe('when is called', () => {
      var response;
      beforeEach(async () => {
        response = await roleController.getRoles();
      });

      it('should call service.all', () => {
        expect(roleService.all).toBeCalled();
      });

      it('should return id', () => {
        expect(response).toEqual([roleDtoStub()]);
      });
    });
  });

  describe('create role', () => {
    describe('when is called', () => {
      var response;
      beforeEach(async () => {
        response = await roleController.createRole({ name: 'roleName' });
      });

      it('should call service.create', () => {
        expect(roleService.create).toBeCalled();
      });

      it('should call service.create with proper data', () => {
        expect(roleService.create).toBeCalledWith('roleName');
      });

      it('should return id', () => {
        expect(response).toEqual(1);
      });
    });
  });

  describe('edit role', () => {
    describe('when is called', () => {
      var response;
      beforeEach(async () => {
        var stub = roleDtoStub();
        response = await roleController.editRole(stub.id, { name: stub.name });
      });

      it('should call service.edit', () => {
        expect(roleService.edit).toBeCalled();
      });

      it('should call service.edit with proper data', () => {
        expect(roleService.edit).toBeCalledWith(roleDtoStub());
      });

      it('should return updated data', () => {
        expect(response).toEqual(roleDtoEditedStub());
      });
    });
  });

  describe('delete role', () => {
    describe('when is called', () => {
      var response;
      beforeEach(async () => {
        response = await roleController.deleteRole(roleDtoStub().id);
      });

      it('should call service.delete', () => {
        expect(roleService.delete).toBeCalled();
      });

      it('should call service.delete with proper data', () => {
        expect(roleService.delete).toBeCalledWith(roleDtoStub().id);
      });

      it('should return undefined', () => {
        expect(response).toEqual(undefined);
      });
    });
  });
});
