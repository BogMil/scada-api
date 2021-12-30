import { ClientServiceInterface } from '../client.service';
import { getClientRdtoStub } from '../test/stubs/client.stub';

export const ClientService = jest.fn().mockReturnValue({
  createAsync: jest.fn().mockResolvedValue(1),
  getAllAsync: jest.fn().mockResolvedValue([getClientRdtoStub()]),
  updateAsync: jest
    .fn()
    .mockResolvedValue({ ...getClientRdtoStub(), name: 'new client name' }),
  deleteAsync: jest.fn().mockResolvedValue(undefined),
} as ClientServiceInterface);
