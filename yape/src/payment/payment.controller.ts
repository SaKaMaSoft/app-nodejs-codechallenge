import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Payment } from './payment.entity';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentFilterDto } from './dto/payment-filter.dto';

@Controller({
    version: '1',
    path: 'payments'
  })
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post()
    createPayment(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
        return this.paymentService.create(createPaymentDto);
    }

    @Patch(':id')
    updatePayment(@Param() params, @Body() updatePaymentDto: UpdatePaymentDto) {
        return this.paymentService.update(params.id, updatePaymentDto);
    }

    @Get(':id')
    findMe(@Param() params): Promise<Payment> {
        return this.paymentService.findById(params.id);
    }

    @Get()
    findbyFilter(@Body() paymentFilterDto: PaymentFilterDto): Promise<Payment> {
        return this.paymentService.findByFilter(paymentFilterDto);
    }
}