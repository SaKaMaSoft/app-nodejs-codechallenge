import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Debit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}