import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module'; // ✅ Add this

import { User, UserRole } from './users/entities/user.entity';
import { Course } from './courses/entities/course.entity';
import { Enrollment } from './enrollments/entities/enrollment.entity'; // ✅ Add this

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +(process.env.DB_PORT || 5432),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'prajakta',
      database: process.env.DB_NAME || 'online_learning_platform',
      entities: [User, Course, Enrollment], // ✅ Add Enrollment entity
      synchronize: true,
    }),

    AuthModule,
    UsersModule,
    CoursesModule,
    EnrollmentsModule, // ✅ Register EnrollmentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
