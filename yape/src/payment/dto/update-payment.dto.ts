import { IsNotEmpty } from 'class-validator';

export class UpdatePaymentDto {
    @IsNotEmpty()
    readonly status: string;
}