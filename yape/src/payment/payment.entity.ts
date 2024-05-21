import { Credit } from 'src/others/credit.entity';
import { Debit } from 'src/others/debit.entity';
import { Status } from 'src/others/status.entity';
import { TransactionType } from 'src/others/type.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, UpdateDateColumn, CreateDateColumn, JoinColumn } from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  value: number

  @ManyToOne(type => TransactionType, transactionType => transactionType.id, { eager: true })
  @JoinColumn()  
  transactionTypeId: number

  @ManyToOne(type => Status, status => status.id, { eager: true })
  @JoinColumn()
  status: number

  @ManyToOne(type => Debit, debit => debit.id)
  accountExternalIdDebit: Debit;

  @ManyToOne(type => Credit, credit => credit.id)  
  accountExternalIdCredit: Credit;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updated_at: Date;
}