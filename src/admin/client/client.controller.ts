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
import { ClientService } from './client.service';
import { ClientDto } from './dto/client.dto';

@ApiTags('admin - client')
@Controller('admin')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Get('clients')
  async getAllAsync() {
    return await this.clientService.getAllAsync();
  }

  @Post('clients')
  async createAsync(@Body() dto: ClientDto) {
    return await this.clientService.createAsync(dto);
  }

  @Put('clients/:id')
  async updateAsync(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ClientDto,
  ) {
    return await this.clientService.updateAsync({ name: dto.name, id });
  }

  @Delete('clients/:id')
  async deleteAsync(@Param('id', ParseIntPipe) id: number) {
    return await this.clientService.deleteAsync(id);
  }
}
