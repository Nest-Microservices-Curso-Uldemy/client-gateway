import { Controller, Get, Post, Body, Param, Inject, Patch, ParseUUIDPipe, Query } from '@nestjs/common';
import { CreateOrderDto, PaginationOrderDto, StatusDto } from './dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from 'src/config';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
	constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

	@Post()
	create(@Body() createOrderDto: CreateOrderDto) {
		return this.client.send('createOrder', createOrderDto).pipe(
			catchError((err) => {
				throw new RpcException(err);
			}),
		);
	}

	@Get()
	findAll(@Query() paginationDto: PaginationOrderDto) {
		return this.client.send('findAllOrders', paginationDto).pipe(
			catchError((err) => {
				throw new RpcException(err);
			}),
		);
	}

	@Get('id/:id')
	findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.client.send('findOneOrder', { id }).pipe(
			catchError((err) => {
				throw new RpcException(err);
			}),
		);
	}

	@Get(':status')
	findAllByStatus(@Param() statusDto: StatusDto, @Query() paginationDto: PaginationDto) {
		return this.client.send('findAllOrders', { stratus: statusDto.status, ...paginationDto }).pipe(
			catchError((err) => {
				throw new RpcException(err);
			}),
		);
	}

	@Patch(':id')
	changeOrderStatus(@Param('id', ParseUUIDPipe) id: string, @Body() statusDto: StatusDto) {
		return this.client.send('changeOrderStatus', { id, status: statusDto.status }).pipe(
			catchError((err) => {
				throw new RpcException(err);
			}),
		);
	}
}
