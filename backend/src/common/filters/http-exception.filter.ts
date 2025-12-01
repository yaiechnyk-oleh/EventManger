import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const res: any = exception.getResponse();
        const message = typeof res === 'string' ? res : res.message;

        response.status(status).json({
            statusCode: status,
            message,
            error: res.error ?? undefined,
            timestamp: new Date().toISOString(),
        });
    }
}
