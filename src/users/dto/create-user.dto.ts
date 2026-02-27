import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
} from 'class-validator';

export enum UserRoleEnum {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
}

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEnum(UserRoleEnum)
  @IsNotEmpty()
  role: UserRoleEnum;

  @IsString()
  @IsOptional()
  studentId?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  facultyName?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  tableId?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  teachingCourseIds?: string[];
}


export class UpdateUserDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsEnum(UserRoleEnum)
  @IsOptional()
  role?: UserRoleEnum;

  @IsString()
  @IsOptional()
  studentId?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  facultyName?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  tableId?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  teachingCourseIds?: string[];
}


export class AssignRoleDto {
  @IsEnum(UserRoleEnum)
  @IsNotEmpty()
  role: UserRoleEnum;
}
