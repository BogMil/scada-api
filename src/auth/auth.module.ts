import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { AtStrategy, RtStrategy } from './strategies';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController, RoleController],
  providers: [AuthService, RoleService, RtStrategy, AtStrategy],
})
export class AuthModule {}
