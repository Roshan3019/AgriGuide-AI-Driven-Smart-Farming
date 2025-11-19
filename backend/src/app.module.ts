import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { User } from "./entities/user.entity";
import { Field } from "./entities/field.entity";
import { SoilReport } from "./entities/soil-report.entity";
import { AuthModule } from "./auth/auth.module";
import { FieldsModule } from "./fields/fields.module";
import { SoilReportsModule } from "./soil-reports/soil-reports.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Field, SoilReport],
      synchronize: true, // For development; use migrations in production
    }),
    AuthModule,
    FieldsModule,
    SoilReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
