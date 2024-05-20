import { Credit } from 'src/others/credit.entity';
import { Debit } from 'src/others/debit.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => Debit, debit => debit.id)
  accountExternalIdDebit: Debit;

  @ManyToOne(type => Credit, credit => credit.id)
  accountExternalIdCredit: Credit;

  @Column()
  tranferTypeId: number

  @Column()
  value: number

  @Column()
  status: string

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public created_at: Date;
  
  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updated_at: Date;
}