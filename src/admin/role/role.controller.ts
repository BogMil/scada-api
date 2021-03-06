import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleCDto, RoleDto } from './dto/role.dto';
import { RoleService } from './role.service';

@ApiTags('admin - role')
@Controller('admin')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get('roles')
  async getRoles(): Promise<RoleDto[]> {
    return await this.roleService.all();
  }

  @Post('roles')
  async createRole(@Body() dto: RoleDto): Promise<number> {
    return await this.roleService.create(dto);
  }

  @Put('roles/:id')
  async editRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RoleCDto,
  ): Promise<RoleDto> {
    return await this.roleService.edit({ id, name: dto.name });
  }

  @Delete('roles/:id')
  async deleteRole(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.roleService.delete(id);
  }
}
