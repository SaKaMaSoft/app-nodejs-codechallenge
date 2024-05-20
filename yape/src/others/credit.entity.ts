import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Credit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}