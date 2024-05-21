import { IsNotEmpty, IsUUID } from 'class-validator';

export class PaymentFilterDto {
    @IsNotEmpty()
    @IsUUID()
    readonly transactionExternalId: string;

    @IsNotEmpty()
    readonly transactionType: { name: string };
    
    @IsNotEmpty()
    readonly transactionStatus: { name: string };
}