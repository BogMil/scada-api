import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RoleController } from '../admin/role/role.controller';
import { AtStrategy, RtStrategy } from './strategies';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, RtStrategy, AtStrategy],
})
export class AuthModule {}
