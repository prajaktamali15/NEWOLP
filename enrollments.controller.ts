import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { RolesGuard } from '../auth/roles.guard';
import { EnrollmentsService } from './enrollments.service';
import { Request } from 'express';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  // ✅ FIX: Read courseId from URL param instead of body
  @Post(':courseId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  async enroll(@Param('courseId') courseId: string, @Req() req: Request) {
    const user = req.user as any;
    const studentId = user?.userId;
    if (!studentId) throw new NotFoundException('Student ID not found');
    return this.enrollmentsService.enroll(+courseId, studentId);
  }

  @Get('my-courses')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  async getMyCourses(@Req() req: Request) {
    const user = req.user as any;
    const studentId = user?.userId;
    return this.enrollmentsService.getEnrolledCourses(studentId);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  async getAllEnrollments() {
    return this.enrollmentsService.getAllEnrollments();
  }
}
