import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class TransactionType {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;
}