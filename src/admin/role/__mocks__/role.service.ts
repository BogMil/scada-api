import { RoleServiceInterface } from '../role.service';
import { roleDtoEditedStub, roleDtoStub } from '../test/stubs/roleDto.stub';

export const RoleService = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(1),
  edit: jest.fn().mockReturnValue(roleDtoEditedStub()),
  delete: jest.fn().mockReturnValue(undefined),
  all: jest.fn().mockReturnValue([roleDtoStub()]),
} as RoleServiceInterface);
