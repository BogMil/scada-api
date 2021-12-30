import { ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AtGuard, RtGuard } from 'src/common/guards';
import { ClientController } from '../client.controller';
import { ClientService } from '../client.service';
import { getClientCdtoStub, getClientRdtoStub } from './stubs/client.stub';

jest.mock('../client.service.ts');

describe('ClientController', () => {
  let clientController: ClientController;
  let clientService: ClientService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [ClientController],
      providers: [ClientService],
    })
      .overrideGuard(RtGuard)
      .useValue({
        canActivate: (_: ExecutionContext) => {
          return true;
        },
      })
      .overrideGuard(AtGuard)
      .useValue({
        canActivate: (_: ExecutionContext) => {
          return true;
        },
      })
      .compile();

    clientService = moduleRef.get<ClientService>(ClientService);
    clientController = moduleRef.get<ClientController>(ClientController);
    jest.clearAllMocks();
  });

  describe('get all', () => {
    describe('when called', () => {
      var res;
      beforeEach(async () => {
        res = await clientController.getAllAsync();
      });

      it('should call service.getAll', () => {
        expect(clientService.getAllAsync).toBeCalled();
      });

      it('should return array of dtos', () => {
        expect(res).toEqual([getClientRdtoStub()]);
      });
    });
  });

  describe('create', () => {
    describe('when called', () => {
      var res;
      beforeEach(async () => {
        res = await clientController.createAsync(getClientCdtoStub());
      });

      it('should call service.createAsync', () => {
        expect(clientService.createAsync).toBeCalled();
      });
      it('should call service.createAsync with proper data', () => {
        expect(clientService.createAsync).toBeCalledWith(getClientCdtoStub());
      });

      it('should return new id', () => {
        expect(res).toEqual(1);
      });
    });
  });

  describe('update', () => {
    describe('when called', () => {
      var res;
      beforeEach(async () => {
        res = await clientController.updateAsync(1, {
          name: 'new client name',
        });
      });

      it('should call service.updateAsync', () => {
        expect(clientService.updateAsync).toBeCalled();
      });
      it('should call service.updateAsync with proper data', () => {
        expect(clientService.updateAsync).toBeCalledWith({
          name: 'new client name',
          id: 1,
        });
      });

      it('should return updated client', () => {
        expect(res).toEqual({
          ...getClientRdtoStub(),
          name: 'new client name',
        });
      });
    });
  });

  describe('delete', () => {
    describe('when called', () => {
      var res;
      beforeEach(async () => {
        res = await clientController.deleteAsync(1);
      });

      it('should call service.deleteAsync', () => {
        expect(clientService.deleteAsync).toBeCalled();
      });

      it('should return undefined', () => {
        expect(res).toEqual(undefined);
      });
    });
  });
});
