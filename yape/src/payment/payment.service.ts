import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { Repository } from 'typeorm';
import { KafkaService } from 'src/kafka/kafka.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {

    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
    ) { }

    /**
     * Functions that allow to save Payment into Database.
     * @param createPaymentDto CreatePaymentDto object that contains data to be created
     * @returns Promise<Payment> Object
     */
    async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
        const payment = new Payment();
        payment.accountExternalIdCredit = createPaymentDto.accountExternalIdCredit;
        payment.accountExternalIdDebit = createPaymentDto.accountExternalIdDebit;
        payment.tranferTypeId = createPaymentDto.tranferTypeId;
        payment.value = createPaymentDto.value;
        payment.status = 'PENDING';
        
        // TODO: Log to be changed to observability library.
        console.log(payment);
        const newPayment = await this.paymentRepository.save(payment);
        const kafkaService = new KafkaService();
        
        // Sending message to Kafka for fraud validation.
        kafkaService.sendMessage('test-topic', newPayment.id.toString());
        return newPayment;
    }

    /**
     * Functions that allows to update Payment status into Database.
     * @param id Payment Id to be updated.
     * @param updatePaymentDto UpdatePaymentDto object that contains data to be updated.
     */
    async update(id: string, updatePaymentDto: UpdatePaymentDto) {
        const { affected } = await this.paymentRepository.update({ id }, { status: updatePaymentDto.status });
        if (affected === 0) {
            throw new HttpException('Payment was not found.', HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Functions that allows to retrieve Payment data base on id.
     * @param id Payment Id to be find
     * @returns Promise<Payment> with payment information
     */
    async findById(id: string): Promise<Payment> {
        const payment = await this.paymentRepository.findOneBy({ id });
        if (!payment) {
            throw new HttpException('Payment was not found.', HttpStatus.NOT_FOUND);
        }
        return payment;
    }
}
