import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('fields')
export class Field {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string; // Simple string for now; later use GeoJSON

  @Column('float')
  size: number; // In acres

  @Column('float', { nullable: true })
  latitude?: number;

  @Column('float', { nullable: true })
  longitude?: number;

  @Column('float', { nullable: true })
  baselinePh?: number;

  @Column('float', { nullable: true })
  baselineOrganicCarbon?: number;

  @Column('float', { nullable: true })
  baselineClayPercent?: number;

  @Column('float', { nullable: true })
  baselineSandPercent?: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}