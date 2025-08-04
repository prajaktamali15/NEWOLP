// src/users/dto/create-user.dto.ts
import { UserRole } from '../entities/user.entity';
import { IsEnum } from 'class-validator';
export class CreateUserDto {
 @IsEnum(UserRole)
  email: string;
  password: string;
  name?: string;
  role?: UserRole; // Add this if not present
}
