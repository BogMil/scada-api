import { RoleDto } from 'src/admin/role/dto/role.dto';

export const getRoleDtoStub = (): RoleDto => {
  return { name: 'role name', id: 1 };
};

export const getRoleDtoEditedStub = (): RoleDto => {
  return { name: 'new role name', id: 1 };
};
