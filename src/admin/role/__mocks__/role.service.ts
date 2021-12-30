import { RoleServiceInterface } from '../role.service';
import {
  getRoleDtoEditedStub,
  getRoleDtoStub,
} from '../test/stubs/roleDto.stub';

export const RoleService = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(1),
  edit: jest.fn().mockReturnValue(getRoleDtoEditedStub()),
  delete: jest.fn().mockReturnValue(undefined),
  all: jest.fn().mockReturnValue([getRoleDtoStub()]),
} as RoleServiceInterface);
