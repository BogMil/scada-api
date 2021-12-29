import { HttpException, HttpStatus } from '@nestjs/common';

export class UniqueConstaintFailedPrismaException extends HttpException {
  constructor(message) {
    super(`Unique failed on ${message}`, HttpStatus.CONFLICT);
  }
}
