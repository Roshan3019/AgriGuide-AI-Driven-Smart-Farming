import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Field } from './field.entity';

@Entity('soil_reports')
export class SoilReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fieldId: number;

  @ManyToOne(() => Field)
  @JoinColumn({ name: 'fieldId' })
  field: Field;

  @Column('float')
  pH: number;

  @Column('float')
  nitrogen: number;

  @Column('float')
  phosphorus: number;

  @Column('float')
  potassium: number;

  @Column('float')
  organicCarbon: number;

  @Column('float')
  moisture: number;

  @Column()
  fertilityCategory: string;

  @Column('text')
  recommendations: string;

  @CreateDateColumn()
  createdAt: Date;
}