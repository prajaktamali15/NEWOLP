import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCourseDto } from 'auth/dto/create-course.dto';
import { UpdateCourseDto } from 'auth/dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  findAll() {
    return this.courseRepository.find();
  }

  async deleteCourse(id: number): Promise<boolean> {
    const result = await this.courseRepository.delete(id);
    if (result.affected === 0) {
      return false;
    }
    return true;
  }

  async createCourse(dto: CreateCourseDto, instructorId: number): Promise<Course> {
    const course = this.courseRepository.create({
      ...dto,
      instructorId: instructorId,
    });
    return this.courseRepository.save(course);
  }

  async findCourseById(id: number): Promise<Course | null> {
    return this.courseRepository.findOne({ where: { id } });
  }

  async updateCourse(id: number, dto: UpdateCourseDto, userId: number, userRole: string): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) throw new NotFoundException(`Course with ID ${id} not found`);

    if (userRole !== 'admin' && course.instructorId !== userId) {
      throw new ForbiddenException('You can only update your own courses');
    }

    Object.assign(course, dto);
    return this.courseRepository.save(course);
  }
}
