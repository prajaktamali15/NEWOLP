// src/courses/courses.controller.ts (updated with PATCH route)
import {
  Controller,
  Get,
  Delete,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { RolesGuard } from '../auth/roles.guard';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from '../auth/dto/create-course.dto';
import { UpdateCourseDto } from '../auth/dto/update-course.dto';
import { Request } from 'express';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async findOne(@Param('id') id: string) {
    const course = await this.coursesService.findCourseById(+id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  async createCourse(@Body() dto: CreateCourseDto, @Req() req: Request) {
    const user = req.user as { userId: number };
    const instructorId = user?.userId;
    if (!instructorId) {
      throw new NotFoundException('Instructor ID not found in request');
    }
    return this.coursesService.createCourse(dto, instructorId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async updateCourse(
    @Param('id') id: string,
    @Body() dto: UpdateCourseDto,
    @Req() req: Request,
  ) {
    const user = req.user as { userId: number; role: string };
    return this.coursesService.updateCourse(+id, dto, user.userId, user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteCourse(@Param('id') id: string) {
    const deleted = await this.coursesService.deleteCourse(+id);
    if (!deleted) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return { message: `Course with ID ${id} deleted successfully` };
  }
}
