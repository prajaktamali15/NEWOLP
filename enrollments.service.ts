import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { Course } from '../courses/entities/course.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Enroll a student in a course
  async enroll(courseId: number, studentId: number): Promise<Enrollment> {
    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');

    const student = await this.userRepository.findOne({ where: { id: studentId } });
    if (!student) throw new NotFoundException('Student not found');

    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: {
        course: { id: courseId },
        user: { id: studentId },
      },
    });

    if (existingEnrollment) {
      return existingEnrollment;
    }

    const enrollment = this.enrollmentRepository.create({
      course,
      user: student,
    });

    return this.enrollmentRepository.save(enrollment);
  }

async getAllEnrollments() {
  return this.enrollmentRepository.find({
    relations: ['user', 'course'],
  });
}


  // Get all courses a student is enrolled in
  async getEnrolledCourses(studentId: number): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({
      where: {
        user: { id: studentId },
      },
      relations: ['course'],
    });
  }
}
