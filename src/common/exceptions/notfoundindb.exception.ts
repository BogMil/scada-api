import { HttpException, HttpStatus } from '@nestjs/common';

// #P2025 in prisma
export class NotFoundInDbPrismaException extends HttpException {
  constructor(message = 'Not found in db') {
    super(message, HttpStatus.NOT_FOUND);
  }
}
