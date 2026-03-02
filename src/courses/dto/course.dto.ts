import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  IsMongoId,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class LocationDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  latitude?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  longitude?: number;

  @IsString()
  @IsOptional()
  building?: string;
}

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  courseCode: string;

  @IsString()
  @IsNotEmpty()
  courseName: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsMongoId()
  @IsNotEmpty()
  teacherId: string;

  @IsString()
  @IsOptional()
  department?: string;

  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location?: LocationDto;

  @IsString()
  @IsOptional()
  roomLocation?: string;

  // 👇 เพิ่มตารางสอน เพื่อใช้ผูกกับระบบเช็คเวลา
  @IsString()
  @IsOptional()
  schedule?: string;

  // 👇 เพิ่ม isActive
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  semester?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  academicYear?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  totalClasses?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  credits?: number;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  studentIds?: string[];
}

export class UpdateCourseDto {
  @IsString()
  @IsOptional()
  courseName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsMongoId()
  @IsOptional()
  teacherId?: string;

  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location?: LocationDto;

  @IsString()
  @IsOptional()
  schedule?: string;

  @IsNumber()
  @IsOptional()
  totalClasses?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class AddStudentsToCourseDto {
  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  studentIds: string[];
}

export class RemoveStudentsFromCourseDto {
  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  studentIds: string[];
}
