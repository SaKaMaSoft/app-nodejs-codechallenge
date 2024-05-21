import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Status {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;
}