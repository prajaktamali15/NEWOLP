import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRole } from '../users/entities/user.entity';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express';

// Define interface for JWT payload attached to request.user
interface JwtUserPayload {
  sub: number;       // user ID (mapped from 'sub' in token)
  username: string;
  role: UserRole;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('role') role: UserRole = UserRole.STUDENT,
  ) {
    if (!username || !password) {
      throw new BadRequestException('Username and password are required');
    }

    return this.authService.register(username, password, role);
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    if (!username || !password) {
      throw new BadRequestException('Username and password are required');
    }

    return this.authService.login(username, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: Request) {
    const user = req.user as JwtUserPayload | undefined;
    if (!user) {
      throw new BadRequestException('User info not found in request');
    }

    return this.authService.getProfile(user.sub);
  }
}
