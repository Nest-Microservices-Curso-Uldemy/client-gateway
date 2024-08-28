import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { LoginUserDto, RegisterUserDto } from './dto';
import { catchError } from 'rxjs';
import { AuthGuard } from './guards';
import { Token, User } from './decorators';
import { CurrentUser } from './interfaces';

@Controller('auth')
export class AuthController {
	constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

	@Post('register')
	registerUser(@Body() registerUserDto: RegisterUserDto) {
		return this.client.send({ cmd: 'auth.register.user' }, registerUserDto).pipe(
			catchError((error) => {
				throw new RpcException(error);
			}),
		);
	}

	@Post('login')
	loginUser(@Body() loginUserDto: LoginUserDto) {
		console.log(loginUserDto);
		return this.client.send({ cmd: 'auth.login.user' }, loginUserDto).pipe(
			catchError((error) => {
				throw new RpcException(error);
			}),
		);
	}

	@UseGuards(AuthGuard)
	@Get('verify')
	verifyToken(@User() user: CurrentUser, @Token() token: string) {
		// const user = req['user'];
		// const token = req['token'];

		// return this.client.send('auth.verify.user', {});
		return { user, token };
	}
}
