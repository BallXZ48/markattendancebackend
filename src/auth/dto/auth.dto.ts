import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsString,
} from 'class-validator';

export class AuthDto {
  @IsEmail({}, { message: 'รูปแบบอีเมลไม่ถูกต้อง' })
  email: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร' })
  password: string;

  @IsString()
  @IsOptional()
  fullName?: string;
}
