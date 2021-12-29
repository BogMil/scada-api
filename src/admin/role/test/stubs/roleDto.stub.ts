import { RoleDto } from 'src/admin/role/dto/role.dto';

export const roleDtoStub = (): RoleDto => {
  return { name: 'role name', id: 1 };
};

export const roleDtoEditedStub = (): RoleDto => {
  return { name: 'new role name', id: 1 };
};
