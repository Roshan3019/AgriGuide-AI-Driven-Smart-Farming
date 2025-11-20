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

  @Column('float', { nullable: true })
  temperature: number | null;

  @Column('float', { nullable: true })
  humidity: number | null;

  @Column('float', { nullable: true })
  windSpeed: number | null;

  @Column('float', { nullable: true })
  rainfall: number | null;

  @Column('float', { nullable: true })
  soilMoisture: number | null;

  @Column('float', { nullable: true })
  soilTemperature: number | null;

  @CreateDateColumn()
  createdAt: Date;
}