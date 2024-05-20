import { IsInt, IsNumber, IsUUID, Max } from "class-validator";
import { Credit } from "src/others/credit.entity";
import { Debit } from "src/others/debit.entity";

export class CreatePaymentDto {
    @IsUUID()
    accountExternalIdCredit: Credit;

    @IsUUID()
    accountExternalIdDebit: Debit;

    @IsNumber()
    tranferTypeId: number;

    @IsInt()
    @Max(1000)
    value: number;
}