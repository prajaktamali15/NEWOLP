// auth/dto/register.dto.ts
export class RegisterDto {
  username: string;
  password: string;
  role: 'student' | 'instructor' | 'admin'; // Adjust as needed
}