import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export abstract class RoleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export class RoleCDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
