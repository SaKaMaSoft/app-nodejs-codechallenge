import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { Repository, Transaction } from 'typeorm';
import { KafkaService } from 'src/kafka/kafka.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { PaymentFilterDto } from './dto/payment-filter.dto';
import { STATUS_PENDING } from 'src/constants/status';
import { TransactionType } from 'src/others/type.entity';

@Injectable()
export class PaymentService {

    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
        @InjectRedis() private readonly redis: Redis
    ) { }

    /**
     * Functions that allow to save Payment into Database.
     * @param createPaymentDto CreatePaymentDto object that contains data to be created
     * @returns Promise<Payment> Object
     */
    async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
        const transactionTypeId = await this.getTransactionTypeById(createPaymentDto.transactionTypeId)
        const payment = new Payment();
        payment.accountExternalIdCredit = createPaymentDto.accountExternalIdCredit;
        payment.accountExternalIdDebit = createPaymentDto.accountExternalIdDebit;
        payment.transactionTypeId = transactionTypeId;
        payment.value = createPaymentDto.value;
        payment.status = STATUS_PENDING;
        const newPayment = await this.paymentRepository.save(payment);
        const kafkaService = new KafkaService();

        // Sending message to Kafka for fraud validation.
        kafkaService.sendMessage('test-topic', newPayment.id.toString());
        return newPayment;
    }

    async getTransactionTypeById(transactionType: number) {
        const transactionTypes = JSON.parse(await this.redis.get("type"));
        const find = transactionTypes.filter((data) => data.id === transactionType);
        if (find.length === 0) {
            throw new HttpException('Transaction type id is not valid.', HttpStatus.CONFLICT);
        }
        // TODO: Log to be changed to observability library.
        console.log('find[getTransactionTypeById]', find[0].id);
        return find[0].id;
    }

    async getTransactionTypeByName(transactionName: string) {
        const transactionTypes = JSON.parse(await this.redis.get("type"));
        const find = transactionTypes.filter((data) => data.name === transactionName);
        if (find.length === 0) {
            throw new HttpException('Transaction name is not valid.', HttpStatus.CONFLICT);
        }
        // TODO: Log to be changed to observability library.
        console.log('find[getTransactionTypeByName]', find[0].id);
        return find[0].id;
    }

    async getStatus(status: string) {
        const statuses = JSON.parse(await this.redis.get("status"));
        const find = statuses.filter((data) => data.name === status);
        if (find.length === 0) {
            throw new HttpException('Status name is not valid.', HttpStatus.CONFLICT);
        }
        // TODO: Log to be changed to observability library.
        console.log('find[getStatus]', find[0].id);
        return find[0].id;
    }

    /**
     * Functions that allows to update Payment status into Database.
     * @param id Payment Id to be updated.
     * @param updatePaymentDto UpdatePaymentDto object that contains data to be updated.
     */
    async update(id: string, updatePaymentDto: UpdatePaymentDto) {
        const status = await this.getStatus(updatePaymentDto.status)
        const { affected } = await this.paymentRepository.update({ id }, { status });
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
        console.log(id);
        if (!id) {
            throw new HttpException('Payment was not found.', HttpStatus.NOT_FOUND);
        }
        const payment = await this.paymentRepository.find({
            loadRelationIds: true,
            where: { id }
        });
        console.log(payment);
        if (payment.length === 0) {
            throw new HttpException('Payment was not found.', HttpStatus.NOT_FOUND);
        }
        return payment[0];
    }

    async findByFilter(paymentFilterDto: PaymentFilterDto): Promise<Payment> {
        const id = paymentFilterDto.transactionExternalId;
        const transactionTypeId = await this.getTransactionTypeByName(paymentFilterDto.transactionType.name);
        const status = await this.getStatus(paymentFilterDto.transactionStatus.name);
        // TODO: It's pending to implement query by amount.
        const payment = await this.paymentRepository
            .createQueryBuilder('payment')
            .leftJoinAndSelect("payment.transactionTypeId", "type")
            .leftJoinAndSelect("payment.status", "status")
            .where("payment.transactionTypeId = :type", { type: transactionTypeId })
            .andWhere("payment.id = :id", { id })
            .andWhere("payment.status = :status", { status })
            // .select(["payment.id"])
            .execute();
        if (payment.length === 0) {
            throw new HttpException('Payment was not found.', HttpStatus.NOT_FOUND);
        }

        // TODO: Log to be changed to observability library.
        console.log('Information retrieve for id: ', id);
        const paymentMap = new Payment();
        paymentMap.id = payment[0].payment_id;
        paymentMap.value = payment[0].payment_value;
        paymentMap.created_at = payment[0].payment_created_at;
        paymentMap.updated_at = payment[0].payment_updated_at;
        paymentMap.transactionTypeId = payment[0].payment_transactionTypeIdId;
        paymentMap.status = payment[0].payment_statusId;
        paymentMap.accountExternalIdDebit = payment[0].payment_accountExternalIdDebitId;
        paymentMap.accountExternalIdCredit = payment[0].payment_accountExternalIdCreditId;
        return paymentMap;
    }
}
