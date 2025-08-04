import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  instructorId!: number; // You can later set this as a relation if needed
}
