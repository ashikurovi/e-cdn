
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : (exception as Error).message;

        // Handle specific errors like 'aborted', 'ECONNRESET', 'EPIPE'
        if (
            message === 'aborted' ||
            message?.['code'] === 'ECONNRESET' ||
            message?.['code'] === 'EPIPE' ||
            (exception as any).code === 'ECONNRESET' ||
            (exception as any).code === 'EPIPE' ||
            (exception as any).message === 'aborted'
        ) {
            this.logger.warn(`Client connection aborted: ${message}`);
            // If the header is already sent, we can't send another response
            if (!response.headersSent) {
                response.status(400).send();
            }
            return;
        }

        this.logger.error(
            `Http Status: ${status} Error Message: ${JSON.stringify(message)}`,
        );


        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: message,
        });
    }
}
