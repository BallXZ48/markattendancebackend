import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

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
  @IsNotEmpty()
  department: string;

  @IsString()
  @IsNotEmpty()
  roomLocation: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  semester: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  academicYear: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  totalClasses: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  credits: number;

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

  @IsString()
  @IsOptional()
  roomLocation?: string;

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
