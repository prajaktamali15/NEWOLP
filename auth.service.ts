// File: auth.service.ts

import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(username: string, password: string, role: UserRole = UserRole.STUDENT) {
    const existing = await this.userRepository.findOne({ where: { username } });
    if (existing) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      role,
    });

    await this.userRepository.save(user);

    return {
      message: 'User registered',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  async login(username: string, password: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 🔐 Create the payload here
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    // 🔑 Return signed JWT token
    return { access_token: this.jwtService.sign(payload) };
  }

  async getProfile(userId: number): Promise<Omit<User, 'password'> | undefined> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) return undefined;

    const { password, ...rest } = user;
    return rest;
  }
}
