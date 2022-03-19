import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { FastifyReply } from 'fastify';

export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  public catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    return response
      .code(404)
      .send({
        message: {
          statusCode: 404,
          error: 'Not Found',
          message: exception.message,
        },
      });
  }
}
