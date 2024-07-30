import { Catch, ArgumentsHost, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
	catch(exception: RpcException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response: Response = ctx.getResponse();

		const rpcError = exception.getError();

		if (rpcError.toString().includes('Empty response')) {
			const message = rpcError.toString().substring(0, rpcError.toString().indexOf('(') - 1);
			return response.status(HttpStatus.BAD_GATEWAY).json({ status: HttpStatus.BAD_GATEWAY, message });
		}

		if (typeof rpcError === 'object' && 'status' in rpcError && 'message' in rpcError) {
			const status = isNaN(+rpcError.status) ? HttpStatus.BAD_REQUEST : +rpcError.status;
			return response.status(status).json(rpcError);
		}

		response.status(HttpStatus.BAD_REQUEST).json({ status: HttpStatus.BAD_REQUEST, message: rpcError });
	}
}
