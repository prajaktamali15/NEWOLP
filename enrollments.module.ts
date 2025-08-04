// src/enrollments/enrollments.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { Enrollment } from './entities/enrollment.entity';
import { Course } from '../courses/entities/course.entity';
import { User } from '../users/entities/user.entity'; // ✅ Add this
import { UsersModule } from '../users/users.module'; // ✅ Add this

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrollment, Course, User]), // ✅ Include User
    UsersModule, // ✅ Needed to resolve UserRepository dependencies
  ],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
})
export class EnrollmentsModule {}
